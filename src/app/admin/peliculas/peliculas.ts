import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';

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
  formato: string; 
  idioma: string;
  fechaEstreno: Date;
  precioBase: number;
  precioPreventa: number;
  nuevoComentario?: string;
  nuevaCalificacion?: number;
}

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="peliculas-container">
      <header class="header-cine">
        <h1>UTN CINEMAS</h1>
        <p>Viví la experiencia definitiva.</p>
        
        <!-- Buscador y Filtro por Género Integrados -->
        <div class="buscador-box flex-buscador">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            placeholder="Buscar por película o sinopsis...">
          
          <select [(ngModel)]="selectedGenero" class="select-genero">
            <option value="todos">Todos los géneros</option>
            <option value="Acción">Acción</option>
            <option value="Comedia">Comedia</option>
            <option value="Ciencia Ficción">Ciencia Ficción</option>
            <option value="Animación">Animación</option>
            <option value="Familiar">Familiar</option>
            <option value="Thriller">Thriller</option>
          </select>
        </div>

        <!-- Sistema de Pestañas -->
        <div class="tabs">
          <button [class.activo]="tabActual === 'cartelera'" (click)="tabActual = 'cartelera'">Cartelera Actual</button>
          <button [class.activo]="tabActual === 'proximamente'" (click)="tabActual = 'proximamente'">Próximamente</button>
        </div>
      </header>

      <!-- SECCIÓN CARTELERA -->
      <section class="cartelera" *ngIf="tabActual === 'cartelera'">
        <h2>Cartelera Actual y Sistema de Reseñas</h2>
        <div class="grid-peliculas">
          @for (peli of peliculasCarteleraFiltradas; track peli.id) {
            <div class="card-peli">
              <div class="card-header">
                <div>
                  <span class="badge-restriccion">{{ peli.restriccion }}</span>
                  <span class="badge-formato">{{ peli.formato }}</span>
                </div>
                <span class="duracion">{{ peli.duracion }} min | {{ peli.idioma }}</span>
              </div>
              
              <div class="card-body">
                <h3>{{ peli.nombre }}</h3>
                <p class="generos-txt">{{ peli.generos.join(', ') }}</p>
                <p class="precio-txt">Entrada Gral: $ {{ peli.precioBase }}</p>

                <div class="rating-promedio">
                  ⭐ <strong>{{ peli.estrellasPromedio }}</strong> / 5 ({{ peli.resenas.length }} reseñas)
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
                    <input type="text" [(ngModel)]="peli.nuevoComentario" placeholder="Comentario corto...">
                    <select [(ngModel)]="peli.nuevaCalificacion">
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
              <a routerLink="/butacas" [queryParams]="{ pelicula: peli.id, nombre: peli.nombre }" class="btn-funciones">Ver Funciones / Comprar</a>
            </div>
          } @empty {
            <p class="no-results">No se encontraron películas en cartelera con esos filtros.</p>
          }
        </div>
      </section>

      <!-- SECCIÓN PRÓXIMAMENTE Y PREVENTA -->
      <section class="cartelera proximamente" *ngIf="tabActual === 'proximamente'">
        <h2>Próximos Estrenos</h2>
        <div class="grid-peliculas">
          @for (peli of peliculasProximamenteFiltradas; track peli.id) {
            <div class="card-peli">
              <div class="card-header">
                <div>
                  <span class="badge-restriccion">{{ peli.restriccion }}</span>
                  <span class="badge-formato">{{ peli.formato }}</span>
                </div>
                <span class="duracion">{{ peli.duracion }} min | {{ peli.idioma }}</span>
              </div>
              
              <div class="card-body">
                <h3>{{ peli.nombre }}</h3>
                <p class="generos-txt">{{ peli.generos.join(', ') }}</p>
                <p class="sinopsis-txt">{{ peli.sinopsis }}</p>
                
                <div class="estado-estreno">
                  <div *ngIf="esPreventa(peli)" class="preventa-activa">
                    <span class="badge-preventa">¡PREVENTA ABIERTA!</span>
                    <p>Llevá tu entrada hoy por <strong>$ {{ peli.precioPreventa }}</strong> (Precio normal: $ {{ peli.precioBase }})</p>
                  </div>
                  <div *ngIf="!esPreventa(peli)" class="alerta-activa">
                    <p>Fecha de estreno: <strong>{{ peli.fechaEstreno | date:'dd/MM/yyyy' }}</strong></p>
                  </div>
                </div>
              </div>

               <a *ngIf="esPreventa(peli)" routerLink="/butacas" [queryParams]="{ pelicula: peli.id, nombre: peli.nombre }" class="btn-funciones btn-preventa">Comprar Preventa</a>
               <button *ngIf="!esPreventa(peli)" (click)="activarAlerta(peli)" class="btn-alerta">🔔 Activar Alerta</button>
            </div>
          } @empty {
            <p class="no-results">No hay estrenos programados con esos filtros.</p>
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
    
    .flex-buscador {
      display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; max-width: 700px; margin: 0 auto;
      input { flex: 1; min-width: 280px; padding: 0.85rem 1.2rem; border-radius: 30px; border: 1px solid #2f3542; background-color: #1e1e2f; color: white; font-size: 1rem; outline: none; }
      input:focus { border-color: #e94560; }
      .select-genero {
        padding: 0.85rem 1.2rem; border-radius: 30px; border: 1px solid #2f3542; background-color: #1e1e2f; color: white; font-size: 1rem; outline: none; cursor: pointer;
        &:focus { border-color: #e94560; }
      }
    }
    
    .tabs { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }
    .tabs button { background: #1e1e2f; color: white; border: 1px solid #2f3542; padding: 0.8rem 2rem; border-radius: 30px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.2s; }
    .tabs button.activo { background: #e94560; border-color: #e94560; }
    .tabs button:hover:not(.activo) { background: #2f3542; }

    .cartelera { max-width: 1200px; margin: 0 auto; }
    .cartelera h2 { font-size: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid #e94560; padding-left: 10px; }
    .grid-peliculas { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
    .card-peli { background-color: #1a1a2e; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #2f3542; }
    .card-header { padding: 1rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
    
    .badge-restriccion { background-color: #e94560; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    .badge-formato { background-color: #3742fa; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-left: 5px; }
    
    .duracion { font-size: 0.8rem; color: #a4b0be; }
    .card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 0.8rem; }
    .card-body h3 { margin: 0; font-size: 1.25rem; }
    .generos-txt { color: #a4b0be; font-size: 0.85rem; margin: 0; }
    .sinopsis-txt { color: #ccc; font-size: 0.9rem; margin-top: 5px; line-height: 1.4;}
    .precio-txt { color: #2ed573; font-weight: bold; margin: 0; }
    
    .rating-promedio { color: #f39c12; font-size: 0.9rem; }
    .box-resenas { background-color: #141421; padding: 0.75rem; border-radius: 8px; margin-top: auto; }
    .lista-comentarios { max-height: 70px; overflow-y: auto; margin-bottom: 0.5rem; font-size: 0.8rem; color: #dcdde1; }
    .comentario-item { margin-bottom: 0.4rem; }
    .comentario-item p { margin: 0; color: #a4b0be; }
    .form-agregar-resena { display: flex; gap: 0.3rem; }
    .form-agregar-resena input { flex: 1; background: #1e1e2f; border: 1px solid #2f3542; color: white; padding: 0.3rem; border-radius: 4px; font-size: 0.75rem; }
    .form-agregar-resena select { background: #1e1e2f; color: white; border: 1px solid #2f3542; border-radius: 4px; font-size: 0.75rem; }
    .form-agregar-resena button { background-color: #e94560; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
    
    .estado-estreno { margin-top: auto; padding: 10px; background: #141421; border-radius: 8px; text-align: center; }
    .badge-preventa { background: #ff4757; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; display: inline-block; margin-bottom: 5px; }
    
    .btn-funciones { background-color: #e94560; color: white; text-align: center; padding: 0.85rem; text-decoration: none; font-weight: bold; display: block;}
    .btn-funciones:hover { background-color: #d63031; }
    .btn-preventa { background-color: #2ed573; color: #1a1a2e; }
    .btn-preventa:hover { background-color: #26b360; }
    
    .btn-alerta { background-color: #fbc531; color: #1a1a2e; border: none; width: 100%; padding: 0.85rem; font-weight: bold; cursor: pointer; font-size: 1rem;}
    .btn-alerta:hover { background-color: #e1b12c; }
    .no-results { text-align: center; color: #888; grid-column: 1 / -1; font-size: 1.1rem; margin-top: 2rem; }
  `]
})
export class PeliculasComponent implements OnInit {
  isBrowser: boolean;
  nombreUsuarioActual: string = 'Usuario Anónimo';
  
  tabActual: 'cartelera' | 'proximamente' = 'cartelera';
  searchTerm: string = '';
  selectedGenero: string = 'todos';
  
  hoy: Date = new Date();

  peliculas: Pelicula[] = [
    {
      id: 1,
      nombre: 'Deadpool & Wolverine',
      sinopsis: 'Acción y comedia con el multiverso.',
      generos: ['Acción', 'Comedia'],
      duracion: 127,
      restriccion: '+18',
      formato: '3D',
      idioma: 'Subtitulada',
      fechaEstreno: new Date(new Date().setDate(this.hoy.getDate() - 30)),
      precioBase: 6500,
      precioPreventa: 5000,
      estrellasPromedio: 4.8,
      resenas: [{ usuario: 'Santiago', comentario: 'Excelente película!', calificacion: 5 }]
    },
    {
      id: 2,
      nombre: 'Intensa Mente 2',
      sinopsis: 'Nuevas emociones llegan a la mente de Riley.',
      generos: ['Animación', 'Familiar'],
      duracion: 96,
      restriccion: 'ATP',
      formato: '2D',
      idioma: 'Castellano',
      fechaEstreno: new Date(new Date().setDate(this.hoy.getDate() - 15)),
      precioBase: 5500,
      precioPreventa: 4000,
      estrellasPromedio: 4.2,
      resenas: [{ usuario: 'Lucas', comentario: 'Muy divertida y emotiva.', calificacion: 4 }]
    },
    {
      id: 3,
      nombre: 'Avatar: Fuego y Cenizas',
      sinopsis: 'La tribu de las cenizas se revela en Pandora. Una aventura visual sin precedentes.',
      generos: ['Ciencia Ficción', 'Acción'],
      duracion: 190,
      restriccion: '+13',
      formato: '5D',
      idioma: 'Subtitulada',
      fechaEstreno: new Date(new Date().setDate(this.hoy.getDate() + 4)),
      precioBase: 8000,
      precioPreventa: 6000,
      estrellasPromedio: 0,
      resenas: []
    },
    {
      id: 4,
      nombre: 'Misión Imposible 8',
      sinopsis: 'Ethan Hunt se enfrenta a su misión más peligrosa hasta la fecha.',
      generos: ['Acción', 'Thriller'],
      duracion: 156,
      restriccion: '+13',
      formato: '4D',
      idioma: 'Subtitulada',
      fechaEstreno: new Date(new Date().setDate(this.hoy.getDate() + 20)),
      precioBase: 7000,
      precioPreventa: 5500,
      estrellasPromedio: 0,
      resenas: []
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private supabase: SupabaseService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      await this.obtenerNombreUsuario();
      this.cargarReseñasGuardadas();
    }

    this.peliculas.forEach(p => {
      p.nuevoComentario = '';
      p.nuevaCalificacion = 5;
    });
  }

  async obtenerNombreUsuario() {
    try {
      const { data } = await this.supabase.client.auth.getSession();
      
      if (data.session?.user) {
        const userId = data.session.user.id;
        const extraGuardado = localStorage.getItem(`perfil_extra_${userId}`);
        if (extraGuardado) {
          const extra = JSON.parse(extraGuardado);
          if (extra.nombre) {
            this.nombreUsuarioActual = `${extra.nombre} ${extra.apellido || ''}`.trim();
            return;
          }
        }
        this.nombreUsuarioActual = data.session.user.email?.split('@')[0] || 'Usuario Registrado';
      }
    } catch (e) {
      console.warn('No se pudo verificar la sesión.');
    }
  }

  cargarReseñasGuardadas() {
    this.peliculas.forEach(peli => {
      const resenasGuardadas = localStorage.getItem(`resenas_pelicula_${peli.id}`);
      if (resenasGuardadas) {
        peli.resenas = JSON.parse(resenasGuardadas);
        // Recalcular estrellas promedio con las reseñas cargadas
        if (peli.resenas.length > 0) {
          const suma = peli.resenas.reduce((acc, curr) => acc + curr.calificacion, 0);
          peli.estrellasPromedio = Number((suma / peli.resenas.length).toFixed(1));
        }
      }
    });
  }

  guardarReseñasEnStorage(peli: Pelicula) {
    if (this.isBrowser) {
      localStorage.setItem(`resenas_pelicula_${peli.id}`, JSON.stringify(peli.resenas));
    }
  }

  get peliculasFiltradas() {
    return this.peliculas.filter(peli => {
      const cumpleTexto = peli.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          peli.sinopsis.toLowerCase().includes(this.searchTerm.toLowerCase());
      const cumpleGenero = this.selectedGenero === 'todos' || peli.generos.includes(this.selectedGenero);
      return cumpleTexto && cumpleGenero;
    });
  }

  get peliculasCarteleraFiltradas() {
    return this.peliculasFiltradas.filter(p => p.fechaEstreno <= this.hoy);
  }

  get peliculasProximamenteFiltradas() {
    return this.peliculasFiltradas.filter(p => p.fechaEstreno > this.hoy);
  }

  esPreventa(peli: Pelicula): boolean {
    const unDia = 1000 * 60 * 60 * 24;
    const diferenciaDias = (peli.fechaEstreno.getTime() - this.hoy.getTime()) / unDia;
    return diferenciaDias <= 7 && diferenciaDias > 0;
  }

  activarAlerta(peli: Pelicula) {
    alert(`¡Alerta activada exitosamente! Te notificaremos cuando falten 7 días para el estreno de "${peli.nombre}".`);
  }

  agregarResena(peli: Pelicula) {
    if (peli.nuevoComentario && peli.nuevoComentario.trim()) {
      peli.resenas.unshift({
        usuario: this.nombreUsuarioActual, 
        comentario: peli.nuevoComentario,
        calificacion: Number(peli.nuevaCalificacion)
      });
      
      const suma = peli.resenas.reduce((acc, curr) => acc + curr.calificacion, 0);
      peli.estrellasPromedio = Number((suma / peli.resenas.length).toFixed(1));
      
      // Guardamos en localStorage para que persista entre cuentas y sesiones
      this.guardarReseñasEnStorage(peli);

      peli.nuevoComentario = '';
      peli.nuevaCalificacion = 5;
    }
  }
}