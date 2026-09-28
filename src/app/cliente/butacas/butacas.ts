import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Butaca {
  id: string;
  fila: string;
  numero: number;
  tipo: 'normal' | 'discapacidad' | 'vip';
  estado: 'disponible' | 'seleccionada' | 'ocupada';
}

@Component({
  selector: 'app-butacas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="butacas-container">
      <header class="header-butacas">
        <h2>Seleccion de Butacas</h2>
        <p>Elige tus asientos para la funcion. Las butacas ocupadas no se pueden seleccionar.</p>
      </header>

      <div class="pantalla-cine">PANTALLA</div>

      <div class="mapa-butacas">
        @for (filaObj of filas; track filaObj.letra) {
          <div class="fila-row">
            <span class="letra-fila">{{ filaObj.letra }}</span>
            <div class="asientos-grid">
              @for (butaca of filaObj.asientos; track butaca.id) {
                <button 
                  [class]="'asiento ' + butaca.tipo + ' ' + butaca.estado"
                  [disabled]="butaca.estado === 'ocupada'"
                  (click)="seleccionarButaca(butaca)"
                  [title]="butaca.id + ' (' + butaca.tipo + ')'">
                  {{ butaca.numero }}
                </button>
              }
            </div>
          </div>
        }
      </div>

      <div class="leyenda">
        <div class="item"><span class="asiento disponible"></span> Disponible</div>
        <div class="item"><span class="asiento seleccionada"></span> Seleccionada</div>
        <div class="item"><span class="asiento ocupada"></span> Ocupada</div>
        <div class="item"><span class="asiento vip"></span> VIP (R, S, T)</div>
        <div class="item"><span class="asiento discapacidad"></span> Accesible (J, K)</div>
      </div>

      <div class="acciones-compra">
        <button class="btn-confirmar" [disabled]="asientosSeleccionados.length === 0" (click)="$event.preventDefault(); confirmarCompra()">
          Confirmar Compra ({{ asientosSeleccionados.length }} seleccionadas)
        </button>
        <a routerLink="/peliculas" class="btn-cancelar">Volver a Peliculas</a>
      </div>
    </div>
  `,
  styles: [`
    .butacas-container {
      background-color: #0f0f1a;
      color: #ffffff;
      min-height: 100vh;
      padding: 2rem;
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .header-butacas {
      text-align: center;
      margin-bottom: 1.5rem;
      h2 { color: #e94560; margin: 0 0 0.5rem 0; }
      p { color: #a4b0be; font-size: 0.9rem; margin: 0; }
    }
    .pantalla-cine {
      background: linear-gradient(to bottom, #e94560, #1a1a2e);
      width: 80%;
      max-width: 600px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 0.8rem;
      letter-spacing: 2px;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(233, 69, 96, 0.4);
    }
    .mapa-butacas {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 50vh;
      overflow-y: auto;
      padding: 1rem;
      background: #141421;
      border-radius: 12px;
      border: 1px solid #2f3542;
      margin-bottom: 1.5rem;
    }
    .fila-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .letra-fila {
      font-weight: bold;
      width: 20px;
      text-align: center;
      color: #e94560;
    }
    .asientos-grid {
      display: flex;
      gap: 0.3rem;
    }
    .asiento {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      font-size: 0.7rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #2ed573;
      color: white;
      transition: transform 0.1s;

      &:hover:not(:disabled) {
        transform: scale(1.1);
      }

      &.seleccionada {
        background-color: #ffa502 !important;
      }

      &.ocupada {
        background-color: #ff4757 !important;
        cursor: not-allowed;
        opacity: 0.6;
      }

      &.vip {
        border: 2px solid #fbc531;
      }

      &.discapacidad {
        background-color: #3742fa;
      }
    }
    .leyenda {
      display: flex;
      gap: 1.5rem;
      font-size: 0.8rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;

      .item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        span {
          width: 15px;
          height: 15px;
          border-radius: 3px;
          display: inline-block;
          &.disponible { background: #2ed573; }
          &.seleccionada { background: #ffa502; }
          &.ocupada { background: #ff4757; }
          &.vip { background: #2ed573; border: 1px solid #fbc531; }
          &.discapacidad { background: #3742fa; }
        }
      }
    }
    .acciones-compra {
      display: flex;
      gap: 1rem;

      .btn-confirmar {
        background-color: #2ed573;
        color: #1a1a2e;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        &:disabled { background-color: #57606f; color: #a4b0be; cursor: not-allowed; }
      }

      .btn-cancelar {
        background-color: #2f3542;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
      }
    }
  `]
})
export class ButacasComponent implements OnInit {
  filas: { letra: string; asientos: Butaca[] }[] = [];
  letrasFilas: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.inicializarAsientos();
  }

  inicializarAsientos() {
    let ocupadasGuardadas: string[] = [];
    
    // Solo leemos de localStorage si estamos en el navegador para evitar errores de SSR
    if (this.isBrowser) {
      ocupadasGuardadas = JSON.parse(localStorage.getItem('butacas_ocupadas') || '[]');
    }

    this.filas = this.letrasFilas.map(letra => {
      let tipoAsiento: 'normal' | 'discapacidad' | 'vip' = 'normal';

      if (letra === 'J' || letra === 'K') {
        tipoAsiento = 'discapacidad';
      } else if (letra === 'R' || letra === 'S' || letra === 'T') {
        tipoAsiento = 'vip';
      }

      const asientosFila: Butaca[] = [];
      for (let i = 1; i <= 14; i++) {
        const idAsiento = `${letra}${i}`;
        const estaOcupada = ocupadasGuardadas.includes(idAsiento);

        asientosFila.push({
          id: idAsiento,
          fila: letra,
          numero: i,
          tipo: tipoAsiento,
          estado: estaOcupada ? 'ocupada' : 'disponible'
        });
      }

      return { letra, asientos: asientosFila };
    });
  }

  seleccionarButaca(butaca: Butaca) {
    if (butaca.estado === 'ocupada') return;
    
    if (butaca.estado === 'disponible') {
      butaca.estado = 'seleccionada';
    } else if (butaca.estado === 'seleccionada') {
      butaca.estado = 'disponible';
    }
  }

  get asientosSeleccionados(): Butaca[] {
    const seleccionados: Butaca[] = [];
    this.filas.forEach(f => {
      f.asientos.forEach(a => {
        if (a.estado === 'seleccionada') {
          seleccionados.push(a);
        }
      });
    });
    return seleccionados;
  }

  confirmarCompra() {
    const seleccionados = this.asientosSeleccionados;
    if (seleccionados.length === 0) return;

    if (this.isBrowser) {
      const ocupadasGuardadas: string[] = JSON.parse(localStorage.getItem('butacas_ocupadas') || '[]');
      const nuevosIds = seleccionados.map(a => a.id);
      const actualizadas = [...ocupadasGuardadas, ...nuevosIds];
      localStorage.setItem('butacas_ocupadas', JSON.stringify(actualizadas));
    }

    alert(`¡Compra confirmada con éxito! Has adquirido ${seleccionados.length} butacas.`);
    window.location.href = '/ticket';
  }
}