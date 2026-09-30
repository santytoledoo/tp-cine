import { Component, OnInit, PLATFORM_ID, Inject, NgZone } from '@angular/core';
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
  isLoggedIn: boolean = false;
  
  usuario = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
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
    private router: Router,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      this.supabaseService.client.auth.onAuthStateChange(async (event, session) => {
        this.ngZone.run(async () => {
          if (session && session.user) {
            this.isLoggedIn = true;
            await this.procesarUsuario(session.user);
          } else {
            this.isLoggedIn = false;
          }
        });
      });
    }
  }

  async procesarUsuario(user: any) {
    this.usuario.id = user.id;
    this.usuario.email = user.email || '';
    
    // 1. Cargar crédito a favor persistente
    const creditoGuardado = localStorage.getItem(`credito_favor_${user.id}`) || localStorage.getItem('credito_favor');
    this.usuario.creditoFavor = creditoGuardado ? Number(creditoGuardado) : 0;

    // 2. Cargar puntos reales del usuario (Si no existen, arranca en 0 reales)
    const puntosGuardados = localStorage.getItem(`puntos_${user.id}`);
    if (puntosGuardados !== null) {
      this.usuario.puntos = Number(puntosGuardados);
    } else {
      this.usuario.puntos = 0; // Usuario nuevo arranca estrictamente en 0 puntos
      localStorage.setItem(`puntos_${user.id}`, '0');
    }

    // 3. Buscar datos en la tabla perfiles de Supabase
    try {
      const { data: perfilData } = await this.supabaseService.client
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (perfilData) {
        this.usuario.nombre = perfilData.nombre || 'Usuario';
        this.usuario.apellido = perfilData.apellido || '';
      } else {
        this.usuario.nombre = user.email?.split('@')[0] || 'Usuario';
        this.usuario.apellido = '';
      }
    } catch (err) {
      this.usuario.nombre = user.email?.split('@')[0] || 'Usuario';
    }

    // 4. Cargar historial de canjes (vacío por defecto para cuentas nuevas)
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