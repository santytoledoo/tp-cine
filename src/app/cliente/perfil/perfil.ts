import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FidelizacionService } from '../../core/services/fidelizacion';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
  isBrowser: boolean;
  cargando: boolean = false;
  isLoggedIn: boolean = false;
  
  usuario = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    tipoSangre: '',
    colorOjos: '',
    diasVacaciones: 0,
    puntos: 0, 
    creditoFavor: 0, 
    esPrimeraCompra: true,
    edad: 0
  };

  historialCanjes: any[] = [];
  mensajeCanje: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fidelizacionService: FidelizacionService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      await this.verificarSesionRapida();
    }
  }

  async verificarSesionRapida() {
    try {
      const sessionPromise = this.supabaseService.client.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
      
      const res: any = await Promise.race([sessionPromise, timeoutPromise]);
      const session = res?.data?.session;

      if (session && session.user) {
        this.isLoggedIn = true;
        await this.procesarUsuario(session.user);
      } else {
        this.isLoggedIn = false;
      }
    } catch (e) {
      console.warn('Verificación de sesión omitida o demorada:', e);
      this.isLoggedIn = false;
    } finally {
      this.cargando = false;
    }
  }

  async procesarUsuario(user: any) {
    this.usuario.id = user.id;
    this.usuario.email = user.email || '';
    
    // 1. Cargar crédito a favor y puntos
    const creditoGuardado = localStorage.getItem(`credito_favor_${user.id}`);
    this.usuario.creditoFavor = creditoGuardado !== null ? Number(creditoGuardado) : 0;

    const puntosGuardados = localStorage.getItem(`puntos_${user.id}`);
    this.usuario.puntos = puntosGuardados !== null ? Number(puntosGuardados) : 0;

    // 2. Cargar datos adicionales desde localStorage (respaldo de registro)
    const extraGuardado = localStorage.getItem(`perfil_extra_${user.id}`);
    if (extraGuardado) {
      const extra = JSON.parse(extraGuardado);
      this.usuario.nombre = extra.nombre || '';
      this.usuario.apellido = extra.apellido || '';
      this.usuario.fechaNacimiento = extra.fechaNacimiento || '';
      this.usuario.tipoSangre = extra.tipoSangre || '';
      this.usuario.colorOjos = extra.colorOjos || '';
      this.usuario.diasVacaciones = extra.diasVacaciones || 0;
    }

    // 3. Buscar o complementar datos en la tabla perfiles de Supabase
    try {
      const { data: perfilData } = await this.supabaseService.client
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (perfilData) {
        this.usuario.nombre = perfilData.nombre || this.usuario.nombre;
        this.usuario.apellido = perfilData.apellido || this.usuario.apellido;
        this.usuario.fechaNacimiento = perfilData.fecha_nacimiento || this.usuario.fechaNacimiento;
        this.usuario.tipoSangre = perfilData.tipo_sangre || this.usuario.tipoSangre;
        this.usuario.colorOjos = perfilData.color_ojos || this.usuario.colorOjos;
        this.usuario.diasVacaciones = perfilData.dias_vacaciones ?? this.usuario.diasVacaciones;
      }
    } catch (err) {
      console.warn('No se pudo conectar a la tabla perfiles de Supabase, usando datos locales.');
    }

    if (!this.usuario.nombre) {
      this.usuario.nombre = user.email?.split('@')[0] || 'Usuario';
    }

    // 4. Cargar historial de canjes
    const canjesGuardados = localStorage.getItem(`historial_canjes_${user.id}`);
    if (canjesGuardados) {
      this.historialCanjes = JSON.parse(canjesGuardados);
    } else {
      this.historialCanjes = [];
      localStorage.setItem(`historial_canjes_${user.id}`, JSON.stringify(this.historialCanjes));
    }
  }

  canjear(tipo: 'entrada' | 'candy') {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para realizar un canje.');
      this.router.navigate(['/login']);
      return;
    }

    const resultado = this.fidelizacionService.canjearRecompensa(this.usuario.puntos, tipo);
    
    if (resultado.exitoso) {
      this.usuario.puntos = resultado.puntosRestantes;
      const nombreRecompensa = tipo === 'entrada' ? '1x Entrada Gratis' : '1x Pochoclo Grande / Candy';
      const puntosGastados = tipo === 'entrada' ? 500 : 150;

      this.historialCanjes.unshift({
        fecha: new Date().toLocaleDateString(),
        recompensa: nombreRecompensa,
        puntosGastados: puntosGastados
      });

      localStorage.setItem(`puntos_${this.usuario.id}`, this.usuario.puntos.toString());
      localStorage.setItem(`historial_canjes_${this.usuario.id}`, JSON.stringify(this.historialCanjes));

      this.mensajeCanje = resultado.mensaje;
    } else {
      this.mensajeCanje = resultado.mensaje;
    }

    setTimeout(() => { this.mensajeCanje = ''; }, 5000);
  }

  async cerrarSesion() {
    try {
      await this.supabaseService.client.auth.signOut();
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    } catch (err) {
      this.router.navigate(['/login']);
    }
  }
}