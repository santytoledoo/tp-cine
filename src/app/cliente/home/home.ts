import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PeliculaHome {
  id: number;
  nombre: string;
  genero: string;
  duracion: string;
  imagen: string;
  ventas: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <header class="hero-section">
        <h1>UTN CINEMAS</h1>
        <p>El sistema oficial de reservas de entradas y confiteria.</p>
        <div class="hero-buttons">
          <a routerLink="/peliculas" class="btn-primary">Ver Cartelera Completa</a>
          <a routerLink="/candybar" class="btn-secondary">Visitar Candy Bar</a>
        </div>
      </header>

      <section class="top-peliculas">
        <h2>Top 3: Las Peliculas Mas Vendidas</h2>
        <p class="section-subtitle">Las favoritas de nuestros espectadores listas para reservar.</p>

        <div class="grid-top">
          @for (peli of topPeliculas; track peli.id; let idx = $index) {
            <div class="card-top">
              <div class="ranking-badge">#{{ idx + 1 }}</div>
              <div class="img-wrapper">
                <img [src]="peli.imagen" [alt]="peli.nombre" (error)="onImgError($event)">
              </div>
              <div class="card-content">
                <h3>{{ peli.nombre }}</h3>
                <p class="genero">{{ peli.genero }} • {{ peli.duracion }}</p>
                <a routerLink="/butacas" class="btn-comprar">Comprar Entradas</a>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      background-color: #0f0f1a;
      color: #ffffff;
      min-height: 100vh;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .hero-section {
      text-align: center;
      padding: 3rem 1rem;
      background: linear-gradient(135deg, #1a1a2e 0%, #141421 100%);
      border-radius: 16px;
      margin-bottom: 3rem;
      border: 1px solid #2f3542;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);

      h1 {
        color: #e94560;
        font-size: 3rem;
        margin-bottom: 0.5rem;
        letter-spacing: 2px;
      }
      p {
        color: #a4b0be;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }
      .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;

        a {
          padding: 0.85rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: transform 0.2s;

          &:hover { transform: translateY(-2px); }
        }
        .btn-primary {
          background-color: #e94560;
          color: white;
          &:hover { background-color: #d63031; }
        }
        .btn-secondary {
          background-color: #2f3542;
          color: white;
          &:hover { background-color: #3f4756; }
        }
      }
    }
    .top-peliculas {
      max-width: 1200px;
      margin: 0 auto;

      h2 {
        font-size: 1.8rem;
        margin-bottom: 0.3rem;
        border-left: 4px solid #e94560;
        padding-left: 10px;
      }
      .section-subtitle {
        color: #a4b0be;
        margin-bottom: 2rem;
        font-size: 0.95rem;
      }

      .grid-top {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;

        .card-top {
          background-color: #1a1a2e;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #2f3542;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          transition: transform 0.2s;

          &:hover { transform: translateY(-5px); }

          .ranking-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background-color: #e94560;
            color: white;
            font-weight: bold;
            padding: 0.3rem 0.7rem;
            border-radius: 6px;
            z-index: 2;
            font-size: 0.9rem;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          }

          .img-wrapper {
            width: 100%;
            height: 280px;
            background-color: #141421;
            overflow: display;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .card-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            flex: 1;

            h3 {
              margin: 0;
              font-size: 1.3rem;
              color: white;
            }
            .genero {
              color: #a4b0be;
              font-size: 0.85rem;
              margin: 0;
            }

            .btn-comprar {
              margin-top: auto;
              background-color: #e94560;
              color: white;
              text-align: center;
              padding: 0.75rem;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              transition: background 0.2s;

              &:hover { background-color: #d63031; }
            }
          }
        }
      }
    }
  `]
})
export class HomeComponent {
  // Top 3 de películas más vendidas con imágenes de alta calidad (URLs públicas y seguras)
  topPeliculas: PeliculaHome[] = [
    {
      id: 1,
      nombre: 'Deadpool & Wolverine',
      genero: 'Acción / Comedia',
      duracion: '127 min',
      imagen: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
      ventas: 1540
    },
    {
      id: 2,
      nombre: 'Dune: Parte Dos',
      genero: 'Ciencia Ficción / Aventura',
      duracion: '166 min',
      imagen: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
      ventas: 1420
    },
    {
      id: 3,
      nombre: 'Intensa Mente 2',
      genero: 'Animación / Familiar',
      duracion: '96 min',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
      ventas: 1280
    }
  ];

  onImgError(event: any) {
    // Imagen de respaldo por si falla la red
    event.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop';
  }
}