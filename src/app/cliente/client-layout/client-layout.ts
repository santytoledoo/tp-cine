import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

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
        <a routerLink="/login" class="btn-login">Ingresar / Admin</a>
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
      .btn-login {
        background-color: #e94560;
        color: white;
        padding: 0.5rem 1.2rem;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        font-size: 0.9rem;
        transition: background 0.2s;
        &:hover {
          background-color: #d63031;
        }
      }
    }
  `]
})
export class ClientLayoutComponent {}