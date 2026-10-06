import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <!-- Barra de Navegación Compartida del Cliente -->
    <nav class="client-navbar">
      <div class="nav-brand" routerLink="/home">🎬 UTN CINEMAS</div>
      <div class="nav-links">
        <a routerLink="/home" routerLinkActive="active">Inicio</a>
        <a routerLink="/mis-peliculas" routerLinkActive="active">Mis Películas</a>
        <a routerLink="/candybar" routerLinkActive="active">Candy Bar</a>
        <a routerLink="/perfil" routerLinkActive="active">Mi Perfil</a>
      </div>
      <div class="nav-auth">
        @if (isLoggedIn) {
          <button (click)="cerrarSesion()" class="btn-logout-nav">Cerrar Sesión</button>
        } @else {
          <a routerLink="/login" class="btn-login">Ingresar</a>
        }
        <!-- Botón de administración protegido con credenciales -->
        <a (click)="ingresarAdmin()" class="btn-admin-link" title="Panel de Administración" style="cursor: pointer;">⚙️ Admin</a>
      </div>
    </nav>

    <!-- Contenido dinámico de las páginas de cliente -->
    <main class="client-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .client-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #1a1a2e;
      padding: 1rem 3rem;
      border-bottom: 1px solid #2f3542;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      position: sticky;
      top: 0;
      z-index: 1000;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .nav-brand {
      color: #e94560;
      font-size: 1.4rem;
      font-weight: bold;
      letter-spacing: 1px;
      cursor: pointer;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      a {
        color: #a4b0be;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: color 0.2s;
        &:hover, &.active {
          color: #ffffff;
        }
      }
    }
    .nav-auth {
      display: flex;
      gap: 1rem;
      align-items: center;
      .btn-login {
        background-color: #e94560;
        color: white;
        padding: 0.5rem 1.2rem;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        font-size: 0.9rem;
        transition: background 0.2s;
        &:hover { background-color: #d63031; }
      }
      .btn-logout-nav {
        background-color: #2f3542;
        color: #ff4757;
        border: 1px solid #ff4757;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: bold;
        font-size: 0.9rem;
        cursor: pointer;
        &:hover { background-color: #ff4757; color: white; }
      }
      .btn-admin-link {
        background-color: #141421;
        color: #fbc531;
        padding: 0.5rem 0.8rem;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        font-size: 0.9rem;
        border: 1px solid #2f3542;
        cursor: pointer;
        &:hover { background-color: #2f3542; }
      }
    }
  `]
})
export class ClientLayoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      await this.checkAuth();
      this.supabase.client.auth.onAuthStateChange((event, session) => {
        this.isLoggedIn = !!session;
      });
    }
  }

  async checkAuth() {
    try {
      const { data: { session } } = await this.supabase.client.auth.getSession();
      this.isLoggedIn = !!session;
    } catch (e) {
      this.isLoggedIn = false;
    }
  }

  async cerrarSesion() {
    await this.supabase.client.auth.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  ingresarAdmin() {
    const usuario = prompt('Ingrese el usuario de Administrador:');
    if (!usuario) return;

    const password = prompt('Ingrese la contraseña de Administrador:');
    if (!password) return;

    const uLimpio = usuario.trim();
    const pLimpio = password.trim();

    if (
      (uLimpio === 'ManuelQuintanaMiño' && pLimpio === 'UTN2026') ||
      (uLimpio === 'JazminMereles' && pLimpio === 'UTN2026')
    ) {
      alert('¡Acceso concedido! Redirigiendo al Panel de Administración...');
      this.router.navigate(['/admin/dashboard']);
    } else {
      alert('Usuario o contraseña incorrectos. Acceso denegado.');
    }
  }
}