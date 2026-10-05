import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
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
  cargando: boolean = true;
  isLoggedIn: boolean = false;
  
  usuario = {
    id: '', nombre: '', apellido: '', email: '', fechaNacimiento: '', tipoSangre: '', colorOjos: '', diasVacaciones: 0, puntos: 0, creditoFavor: 0
  };

  historialCanjes: any[] = [];
  mensajeCanje: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fidelizacionService: FidelizacionService,
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      await this.verificarSesion();
    }
  }

  async verificarSesion() {
    try {
      const { data, error } = await this.supabaseService.client.auth.getSession();
      
      if (data.session?.user) {
        this.isLoggedIn = true;
        await this.procesarUsuario(data.session.user);
      } else {
        this.isLoggedIn = false;
      }
    } catch (e) {
      this.isLoggedIn = false;
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); 
    }
  }

  async procesarUsuario(user: any) {
    this.usuario.id = user.id;
    this.usuario.email = user.email || '';
    
    const creditoGuardado = localStorage.getItem(`credito_favor_${user.id}`);
    this.usuario.creditoFavor = creditoGuardado !== null ? Number(creditoGuardado) : 0;

    const puntosGuardados = localStorage.getItem(`puntos_${user.id}`);
    this.usuario.puntos = puntosGuardados !== null ? Number(puntosGuardados) : 0;

    let fechaCruda = ''; 

    const extraGuardado = localStorage.getItem(`perfil_extra_${user.id}`);
    if (extraGuardado) {
      const extra = JSON.parse(extraGuardado);
      this.usuario.nombre = extra.nombre || '';
      this.usuario.apellido = extra.apellido || '';
      fechaCruda = extra.fechaNacimiento || '';
      this.usuario.tipoSangre = extra.tipoSangre || '';
      this.usuario.colorOjos = extra.colorOjos || '';
      this.usuario.diasVacaciones = extra.diasVacaciones || 0;
    }

    try {
      const { data: perfilData } = await this.supabaseService.client
        .from('perfiles').select('*').eq('id', user.id).maybeSingle();

      if (perfilData) {
        this.usuario.nombre = perfilData.nombre || this.usuario.nombre;
        this.usuario.apellido = perfilData.apellido || this.usuario.apellido;
        fechaCruda = perfilData.fecha_nacimiento || fechaCruda;
        this.usuario.tipoSangre = perfilData.tipo_sangre || this.usuario.tipoSangre;
        this.usuario.colorOjos = perfilData.color_ojos || this.usuario.colorOjos;
        this.usuario.diasVacaciones = perfilData.dias_vacaciones ?? this.usuario.diasVacaciones;
      }
    } catch (err) {}

    if (!this.usuario.nombre) {
      this.usuario.nombre = user.email?.split('@')[0] || 'Usuario';
    }

    // --- LÓGICA PARA INVERTIR LA FECHA DE NACIMIENTO ---
    if (fechaCruda && fechaCruda.includes('-')) {
      const [anio, mes, dia] = fechaCruda.split('-');
      // Si el año tiene 4 dígitos (YYYY-MM-DD), lo damos vuelta a DD-MM-YYYY
      if (anio.length === 4) {
        this.usuario.fechaNacimiento = `${dia}-${mes}-${anio}`;
      } else {
        this.usuario.fechaNacimiento = fechaCruda;
      }
    } else {
      this.usuario.fechaNacimiento = fechaCruda;
    }

    const canjesGuardados = localStorage.getItem(`historial_canjes_${user.id}`);
    this.historialCanjes = canjesGuardados ? JSON.parse(canjesGuardados) : [];
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
      this.historialCanjes.unshift({
        fecha: new Date().toLocaleDateString(),
        recompensa: tipo === 'entrada' ? '1x Entrada Gratis' : '1x Pochoclo Grande / Candy',
        puntosGastados: tipo === 'entrada' ? 500 : 150
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