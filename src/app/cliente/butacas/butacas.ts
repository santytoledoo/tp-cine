import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CuponService } from '../../core/services/cupon';

interface Butaca {
  id: string;
  fila: string;
  numero: number;
  tipo: 'normal' | 'discapacidad' | 'vip';
  estado: 'disponible' | 'seleccionada' | 'ocupada';
}

interface FilaButacas {
  letra: string;
  bloqueIzq: Butaca[];
  bloqueCen: Butaca[];
  bloqueDer: Butaca[];
}

@Component({
  selector: 'app-butacas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="butacas-container">
      <header class="header-butacas">
        <h2>Selección de Butacas</h2>
        <p>Elige tus asientos para la función seleccionada.</p>
      </header>

      <div class="aviso-pelicula-info">
        <p>Película actual: <strong>{{ nombrePelicula }}</strong></p>
      </div>

      <div class="pantalla-cine">PANTALLA</div>

      <div class="mapa-scroll">
        <div class="mapa-butacas">
          @for (filaObj of filas; track filaObj.letra) {
            <div class="fila-row">
              <span class="letra-fila">{{ filaObj.letra }}</span>
              
              <!-- Bloque Izquierdo -->
              <div class="bloque">
                @for (butaca of filaObj.bloqueIzq; track butaca.id) {
                  <button 
                    [class]="'asiento ' + butaca.tipo + ' ' + butaca.estado"
                    [disabled]="butaca.estado === 'ocupada'"
                    (click)="seleccionarButaca(butaca)"
                    [title]="'Fila ' + butaca.fila + ' - Asiento ' + butaca.numero">
                    {{ butaca.numero }}
                  </button>
                }
              </div>

              <div class="pasillo"></div>

              <!-- Bloque Central -->
              <div class="bloque">
                @for (butaca of filaObj.bloqueCen; track butaca.id) {
                  <button 
                    [class]="'asiento ' + butaca.tipo + ' ' + butaca.estado"
                    [disabled]="butaca.estado === 'ocupada'"
                    (click)="seleccionarButaca(butaca)"
                    [title]="'Fila ' + butaca.fila + ' - Asiento ' + butaca.numero">
                    {{ butaca.numero }}
                  </button>
                }
              </div>

              <div class="pasillo"></div>

              <!-- Bloque Derecho -->
              <div class="bloque">
                @for (butaca of filaObj.bloqueDer; track butaca.id) {
                  <button 
                    [class]="'asiento ' + butaca.tipo + ' ' + butaca.estado"
                    [disabled]="butaca.estado === 'ocupada'"
                    (click)="seleccionarButaca(butaca)"
                    [title]="'Fila ' + butaca.fila + ' - Asiento ' + butaca.numero">
                    {{ butaca.numero }}
                  </button>
                }
              </div>

              <span class="letra-fila">{{ filaObj.letra }}</span>
            </div>
          }
        </div>
      </div>

      <div class="leyenda">
        <div class="item"><span class="asiento disponible"></span> Estándar</div>
        <div class="item"><span class="asiento seleccionada"></span> Seleccionada</div>
        <div class="item"><span class="asiento ocupada"></span> Ocupada</div>
        <div class="item"><span class="asiento vip"></span> VIP (R, S, T)</div>
        <div class="item"><span class="asiento discapacidad"></span> Accesible (J, K)</div>
      </div>

      <div class="acciones-compra">
        <button class="btn-confirmar" [disabled]="asientosSeleccionados.length === 0" (click)="$event.preventDefault(); confirmarCompra()">
          Confirmar Compra ({{ asientosSeleccionados.length }} seleccionadas)
        </button>
        <a routerLink="/home" class="btn-cancelar">Volver al Inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .butacas-container {
      background-color: #0f0f1a; color: #ffffff; min-height: 100vh; padding: 2rem; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center;
    }
    .header-butacas {
      text-align: center; margin-bottom: 1rem;
      h2 { color: #e94560; margin: 0 0 0.5rem 0; }
      p { color: #a4b0be; font-size: 0.9rem; margin: 0; }
    }
    .aviso-pelicula-info {
      background: #1a1a2e; border: 1px solid #2f3542; padding: 10px 20px; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.95rem; color: #dcdde1;
    }
    .pantalla-cine {
      background: linear-gradient(to bottom, #e94560, #1a1a2e); width: 80%; max-width: 800px; height: 30px; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 0.8rem; letter-spacing: 4px; margin-bottom: 2rem; box-shadow: 0 5px 15px rgba(233, 69, 96, 0.4);
    }
    .mapa-scroll { width: 100%; overflow-x: auto; display: flex; justify-content: center; }
    .mapa-butacas {
      display: flex; flex-direction: column; gap: 0.4rem; padding: 1.5rem; background: #141421; border-radius: 12px; border: 1px solid #2f3542; margin-bottom: 1.5rem; min-width: 900px;
    }
    .fila-row { display: flex; align-items: center; justify-content: center; }
    .letra-fila { font-weight: bold; width: 30px; text-align: center; color: #e94560; }
    .bloque { display: flex; gap: 0.25rem; justify-content: center; }
    .pasillo { width: 35px; }
    .asiento {
      width: 24px; height: 24px; border-radius: 5px 5px 2px 2px; border: none; font-size: 0.65rem; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; background-color: #2ed573; color: #0f0f1a; transition: transform 0.1s, filter 0.2s;
      &:hover:not(:disabled) { transform: scale(1.15); filter: brightness(1.2); }
      &.seleccionada { background-color: #ffa502 !important; color: white; }
      &.ocupada { background-color: #ff4757 !important; color: rgba(255,255,255,0.5); cursor: not-allowed; opacity: 0.5; }
      &.vip { background-color: #fbc531; }
      &.discapacidad { background-color: #3742fa; color: white; }
    }
    .leyenda {
      display: flex; gap: 1.5rem; font-size: 0.8rem; margin-bottom: 2rem; flex-wrap: wrap; justify-content: center; background: #141421; padding: 10px 20px; border-radius: 8px;
      .item {
        display: flex; align-items: center; gap: 0.5rem;
        span {
          width: 18px; height: 18px; border-radius: 4px; display: inline-block;
          &.disponible { background: #2ed573; } &.seleccionada { background: #ffa502; } &.ocupada { background: #ff4757; } &.vip { background: #fbc531; } &.discapacidad { background: #3742fa; }
        }
      }
    }
    .acciones-compra {
      display: flex; gap: 1rem;
      .btn-confirmar {
        background-color: #2ed573; color: #1a1a2e; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer;
        &:disabled { background-color: #2f3542; color: #747d8c; cursor: not-allowed; }
        &:not(:disabled):hover { background-color: #26b360; }
      }
      .btn-cancelar {
        background-color: #2f3542; color: white; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem;
        &:hover { background-color: #57606f; }
      }
    }
  `]
})
export class ButacasComponent implements OnInit {
  filas: FilaButacas[] = [];
  letrasFilas: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
  isBrowser: boolean;
  peliculaId: string = '1';
  nombrePelicula: string = 'Deadpool & Wolverine';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['pelicula']) {
        this.peliculaId = params['pelicula'];
      }
      if (params['nombre']) {
        this.nombrePelicula = params['nombre'];
      }
      this.inicializarAsientos();
    });
  }

  inicializarAsientos() {
    let ocupadasGuardadas: string[] = [];
    const storageKey = `butacas_ocupadas_pelicula_${this.peliculaId}`;
    
    if (this.isBrowser) {
      ocupadasGuardadas = JSON.parse(localStorage.getItem(storageKey) || '[]');
    }

    this.filas = this.letrasFilas.map(letra => {
      let tipoAsiento: 'normal' | 'discapacidad' | 'vip' = 'normal';
      let cantIzq = 4, cantCen = 20, cantDer = 4;

      if (letra === 'J' || letra === 'K') {
        tipoAsiento = 'discapacidad';
        cantIzq = 2; cantCen = 10; cantDer = 2;
      } else if (letra === 'R' || letra === 'S' || letra === 'T') {
        tipoAsiento = 'vip';
      }

      const generarBloque = (inicio: number, cantidad: number) => {
        const bloque: Butaca[] = [];
        for (let i = 0; i < cantidad; i++) {
          const numeroButaca = inicio + i;
          const idAsiento = `${letra}${numeroButaca}`;
          const estaOcupada = ocupadasGuardadas.includes(idAsiento);

          bloque.push({
            id: idAsiento,
            fila: letra,
            numero: numeroButaca,
            tipo: tipoAsiento,
            estado: estaOcupada ? 'ocupada' : 'disponible'
          });
        }
        return bloque;
      };

      return { 
        letra, 
        bloqueIzq: generarBloque(1, cantIzq),
        bloqueCen: generarBloque(1 + cantIzq, cantCen),
        bloqueDer: generarBloque(1 + cantIzq + cantCen, cantDer)
      };
    });
  }

  seleccionarButaca(butaca: Butaca) {
    if (butaca.estado === 'ocupada') return;
    
    if (butaca.estado === 'disponible') {
      if (butaca.tipo === 'vip') {
        const confirmar = confirm('Esta es una butaca VIP. ¿Deseas continuar?');
        if (!confirmar) return;
      }
      butaca.estado = 'seleccionada';
    } else if (butaca.estado === 'seleccionada') {
      butaca.estado = 'disponible';
    }
  }

  get asientosSeleccionados(): Butaca[] {
    const seleccionados: Butaca[] = [];
    this.filas.forEach(f => {
      seleccionados.push(...f.bloqueIzq.filter(b => b.estado === 'seleccionada'));
      seleccionados.push(...f.bloqueCen.filter(b => b.estado === 'seleccionada'));
      seleccionados.push(...f.bloqueDer.filter(b => b.estado === 'seleccionada'));
    });
    return seleccionados;
  }

  confirmarCompra() {
    const seleccionados = this.asientosSeleccionados;
    if (seleccionados.length === 0) return;

    if (this.isBrowser) {
      const idsAsientos = seleccionados.map(a => a.id).join(', ');
      
      // Guardar datos parciales para el ticket
      const datosParciales = {
        pelicula: this.nombrePelicula,
        sala: `Sala ${this.peliculaId}`, // Sala dinámica basada en la película
        butacas: idsAsientos
      };
      localStorage.setItem('ticket_parcial', JSON.stringify(datosParciales));

      // Marcar butacas como ocupadas en el almacenamiento de esta película
      const storageKey = `butacas_ocupadas_pelicula_${this.peliculaId}`;
      const ocupadasGuardadas: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const nuevosIds = seleccionados.map(a => a.id);
      const actualizadas = [...ocupadasGuardadas, ...nuevosIds];
      localStorage.setItem(storageKey, JSON.stringify(actualizadas));
    }

    this.router.navigate(['/candybar']);
  }
}