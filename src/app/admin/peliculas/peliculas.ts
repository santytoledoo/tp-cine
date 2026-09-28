import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Resena {
  usuario: string;
  comentario: string;
  calificacion: number;
}

interface Pelicula {
  id: number;
  nombre: string;
  sinopsis: string;
  generos: string[];
  duracion: number;
  restriccion: string;
  estrellasPromedio: number;
  resenas: Resena[];
}

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="peliculas-container">
      <header class="header-cine">
        <h1>UTN CINEMAS</h1>
        <p>Vivi la experiencia definitiva.</p>
        <div class="buscador-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            placeholder="Buscar por pelicula o genero (ej. Accion, Comedia)...">
        </div>
      </header>

      <section class="cartelera">
        <h2>Cartelera Actual y Sistema de Reseñas</h2>
        <div class="grid-peliculas">
          @for (peli of peliculasFiltradas; track peli.id) {
            <div class="card-peli">
              <div class="card-header">
                <span class="badge-restriccion">{{ peli.restriccion }}</span>
                <span class="duracion">{{ peli.duracion }} min</span>
              </div>
              <div class="card-body">
                <h3>{{ peli.nombre }}</h3>
                <p class="generos-txt">{{ peli.generos.join(', ') }}</p>
                <div class="rating-promedio">
                  ⭐ <strong>{{ peli.estrellasPromedio }}</strong> / 5 ({{ peli.resenas.length }} resenas)
                </div>
                <div class="box-resenas">
                  <div class="lista-comentarios">
                    @for (res of peli.resenas; track res.comentario) {
                      <div class="comentario-item">
                        <span><strong>{{ res.usuario }}</strong> (⭐{{ res.calificacion }})</span>
                        <p>{{ res.comentario }}</p>
                      </div>
                    }
                  </div>
                  <div class="form-agregar-resena">
                    <input type="text" [(ngModel)]="nuevoComentario" placeholder="Comentario corto...">
                    <select [(ngModel)]="nuevaCalificacion">
                      <option [value]="5">5 ⭐</option>
                      <option [value]="4">4 ⭐</option>
                      <option [value]="3">3 ⭐</option>
                      <option [value]="2">2 ⭐</option>
                      <option [value]="1">1 ⭐</option>
                    </select>
                    <button (click)="agregarResena(peli)">Calificar</button>
                  </div>
                </div>
              </div>
              <a routerLink="/butacas" class="btn-funciones">Ver Funciones / Comprar</a>
            </div>
          } @empty {
            <p class="no-results">No se encontraron peliculas.</p>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .peliculas-container { background-color: #0f0f1a; color: #ffffff; min-height: 100vh; padding: 2rem; font-family: sans-serif; }
    .header-cine { text-align: center; margin-bottom: 3rem; }
    .header-cine h1 { color: #e94560; font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header-cine p { color: #a4b0be; margin-bottom: 1.5rem; }
    .buscador-box input { width: 100%; max-width: 500px; padding: 0.85rem 1.2rem; border-radius: 30px; border: 1px solid #2f3542; background-color: #1e1e2f; color: white; font-size: 1rem; outline: none; }
    .cartelera { max-width: 1200px; margin: 0 auto; }
    .cartelera h2 { font-size: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid #e94560; padding-left: 10px; }
    .grid-peliculas { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
    .card-peli { background-color: #1a1a2e; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #2f3542; }
    .card-header { padding: 1rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
    .badge-restriccion { background-color: #e94560; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    .duracion { font-size: 0.8rem; color: #a4b0be; }
    .card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 0.8rem; }
    .card-body h3 { margin: 0; font-size: 1.25rem; }
    .generos-txt { color: #a4b0be; font-size: 0.85rem; margin: 0; }
    .rating-promedio { color: #f39c12; font-size: 0.9rem; }
    .box-resenas { background-color: #141421; padding: 0.75rem; border-radius: 8px; margin-top: auto; }
    .lista-comentarios { max-height: 70px; overflow-y: auto; margin-bottom: 0.5rem; font-size: 0.8rem; color: #dcdde1; }
    .comentario-item { margin-bottom: 0.4rem; }
    .comentario-item p { margin: 0; color: #a4b0be; }
    .form-agregar-resena { display: flex; gap: 0.3rem; }
    .form-agregar-resena input { flex: 1; background: #1e1e2f; border: 1px solid #2f3542; color: white; padding: 0.3rem; border-radius: 4px; font-size: 0.75rem; }
    .form-agregar-resena select { background: #1e1e2f; color: white; border: 1px solid #2f3542; border-radius: 4px; font-size: 0.75rem; }
    .form-agregar-resena button { background-color: #e94560; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
    .btn-funciones { background-color: #e94560; color: white; text-align: center; padding: 0.85rem; text-decoration: none; font-weight: bold; }
    .btn-funciones:hover { background-color: #d63031; }
  `]
})
export class PeliculasComponent {
  searchTerm: string = '';
  selectedGenero: string = 'todos';

  peliculas: Pelicula[] = [
    {
      id: 1,
      nombre: 'Deadpool & Wolverine',
      sinopsis: 'Accion y comedia con el multiverso.',
      generos: ['Accion', 'Comedia'],
      duracion: 127,
      restriccion: '+18',
      estrellasPromedio: 4.8,
      resenas: [{ usuario: 'Santiago', comentario: 'Excelente pelicula!', calificacion: 5 }]
    },
    {
      id: 2,
      nombre: 'Intensa Mente 2',
      sinopsis: 'Nuevas emociones llegan a la mente.',
      generos: ['Animacion', 'Familiar'],
      duracion: 96,
      restriccion: 'ATP',
      estrellasPromedio: 4.2,
      resenas: [{ usuario: 'Lucas', comentario: 'Muy divertida y emotiva.', calificacion: 4 }]
    }
  ];

  nuevoComentario: string = '';
  nuevaCalificacion: number = 5;

  get peliculasFiltradas() {
    return this.peliculas.filter(peli => {
      const cumpleTexto = peli.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          peli.sinopsis.toLowerCase().includes(this.searchTerm.toLowerCase());
      const cumpleGenero = this.selectedGenero === 'todos' || peli.generos.includes(this.selectedGenero);
      return cumpleTexto && cumpleGenero;
    });
  }

  agregarResena(peli: Pelicula) {
    if (this.nuevoComentario.trim()) {
      peli.resenas.push({
        usuario: 'Usuario Anonimo',
        comentario: this.nuevoComentario,
        calificacion: Number(this.nuevaCalificacion)
      });
      const suma = peli.resenas.reduce((acc, curr) => acc + curr.calificacion, 0);
      peli.estrellasPromedio = Number((suma / peli.resenas.length).toFixed(1));
      this.nuevoComentario = '';
    }
  }
}