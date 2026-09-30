import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TicketComprado {
  id: number;
  titulo: string;
  fechaFuncion: Date;
  sala: string;
  poster: string;
  calificacionUsuario: number;
  comentario: string;
  estado: 'activa' | 'finalizada' | 'cancelada';
  montoPagado: number;
  butacas?: string;
  candybar?: string;
}

@Component({
  selector: 'app-mis-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mis-peliculas-container">
      <header class="header-perfil">
        <div>
          <h2>Mis Películas y Entradas</h2>
          <p class="subtitulo">Gestioná tus próximas funciones, cancelá a tiempo o calificá las películas que ya viste.</p>
        </div>
        
        <div class="credito-box">
          <span class="etiqueta">💰 Crédito a Favor</span>
          <span class="monto">$ {{ miCreditoFavor }}</span>
        </div>
      </header>

      <div class="grilla-historial" *ngIf="historialPeliculas.length > 0; else sinHistorial">
        <div class="pelicula-historial-card" *ngFor="let item of historialPeliculas" [ngClass]="item.estado">
          
          <div class="poster-box">
            <img [src]="item.poster" [alt]="item.titulo">
            <div class="badge-estado">{{ item.estado | uppercase }}</div>
          </div>
          
          <div class="detalle-box">
            <h3>{{ item.titulo }}</h3>
            <p class="fecha-sala">
              📅 {{ item.fechaFuncion | date:'dd/MM/yyyy - HH:mm' }} hs | 🎟️ {{ item.sala }}
              <span *ngIf="item.butacas">| Asientos: {{ item.butacas }}</span>
            </p>
            <p class="monto-pagado">Pagaste: $ {{ item.montoPagado }}</p>

            <div *ngIf="item.estado === 'finalizada'" class="seccion-calificacion">
              <span>Tu Calificación:</span>
              <div class="estrellas-selector">
                <span *ngFor="let star of [1,2,3,4,5]" 
                      (click)="calificar(item, star)"
                      [class.activa]="star <= item.calificacionUsuario">
                  ★
                </span>
              </div>
              <p class="comentario-guardado" *ngIf="item.comentario"><em>"{{ item.comentario }}"</em></p>
            </div>

            <div *ngIf="item.estado === 'activa'" class="seccion-acciones">
              <p class="aviso-cancelacion">
                Podés cancelar hasta 2 horas antes de la función. El dinero se reintegrará como crédito a tu cuenta.
              </p>
              <button 
                class="btn-cancelar" 
                [disabled]="!puedeCancelar(item.fechaFuncion)" 
                (click)="cancelarEntrada(item)">
                Cancelar y recibir $ {{ item.montoPagado }} en crédito
              </button>
              <p class="error-tiempo" *ngIf="!puedeCancelar(item.fechaFuncion)">
                Ya pasó el tiempo límite de cancelación (2 hs).
              </p>
            </div>

            <div *ngIf="item.estado === 'cancelada'" class="seccion-cancelada">
              <p>Esta compra fue cancelada y el saldo fue reintegrado a tu billetera.</p>
            </div>

          </div>
        </div>
      </div>

      <ng-template #sinHistorial>
        <p class="sin-historial">Aún no registraste funciones en tu cuenta.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .mis-peliculas-container {
      min-height: 100vh;
      background-color: #0f0f1a;
      color: #fff;
      padding: 40px 5%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .header-perfil {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
      h2 { color: #e94560; font-size: 2.2rem; margin: 0 0 10px 0; }
      .subtitulo { color: #a4b0be; margin: 0; font-size: 1rem; }
    }
    .credito-box {
      background-color: #1a1a2e;
      padding: 15px 25px;
      border-radius: 12px;
      border: 1px solid #2ed573;
      text-align: center;
      box-shadow: 0 4px 15px rgba(46, 213, 115, 0.2);
      .etiqueta { display: block; font-size: 0.9rem; color: #a4b0be; margin-bottom: 5px; }
      .monto { font-size: 1.8rem; font-weight: bold; color: #2ed573; }
    }
    .grilla-historial { display: flex; flex-direction: column; gap: 20px; max-width: 1000px; margin: 0 auto; }
    .pelicula-historial-card {
      background-color: #1a1a2e;
      border-radius: 12px;
      display: flex;
      overflow: hidden;
      border: 1px solid #2f3542;
      transition: transform 0.2s;
      &.cancelada { opacity: 0.6; filter: grayscale(100%); }
      &:hover { transform: translateY(-3px); border-color: #e94560; }
      .poster-box {
        width: 150px;
        position: relative;
        img { width: 100%; height: 100%; object-fit: cover; }
        .badge-estado {
          position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8);
          padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem;
        }
      }
      .detalle-box {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        h3 { margin: 0 0 8px 0; font-size: 1.4rem; color: #fff; }
        .fecha-sala { color: #a4b0be; font-size: 1rem; margin-bottom: 5px; }
        .monto-pagado { color: #2ed573; font-weight: bold; font-size: 0.95rem; margin-bottom: 15px; }
        .seccion-calificacion {
          display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #bbb; flex-wrap: wrap;
          .estrellas-selector span {
            font-size: 1.5rem; color: #555; cursor: pointer; transition: 0.2s;
            &.activa, &:hover { color: #f5c518; }
          }
          .comentario-guardado { width: 100%; color: #888; margin: 5px 0 0 0; }
        }
        .seccion-acciones {
          background: #141421; padding: 15px; border-radius: 8px; border: 1px dashed #2f3542;
          .aviso-cancelacion { font-size: 0.85rem; color: #a4b0be; margin: 0 0 10px 0; }
          .btn-cancelar {
            background-color: #e94560; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;
            &:disabled { background-color: #2f3542; color: #747d8c; cursor: not-allowed; }
            &:not(:disabled):hover { background-color: #d63031; }
          }
          .error-tiempo { color: #ff4757; font-size: 0.85rem; margin: 10px 0 0 0; font-weight: bold; }
        }
        .seccion-cancelada { color: #ff4757; font-weight: bold; font-size: 0.95rem; }
      }
    }
    .sin-historial { text-align: center; color: #777; font-size: 1.2rem; margin-top: 50px; }
  `]
})
export class MisPeliculasComponent implements OnInit {
  isBrowser: boolean;
  miCreditoFavor: number = 0; // Por defecto arranca en 0 para usuarios nuevos
  hoy: Date = new Date();
  historialPeliculas: TicketComprado[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.cargarCredito();
      this.cargarHistorialReal();
    }
  }

  cargarCredito() {
    const creditoGuardado = localStorage.getItem('credito_favor');
    if (creditoGuardado !== null) {
      this.miCreditoFavor = Number(creditoGuardado);
    } else {
      this.miCreditoFavor = 0; // Si no hay registro, arranca en 0
    }
  }

  cargarHistorialReal() {
    const guardado = localStorage.getItem('historial_compras');
    if (guardado) {
      const parsed = JSON.parse(guardado);
      this.historialPeliculas = parsed.map((item: any) => ({
        ...item,
        fechaFuncion: new Date(item.fechaFuncion)
      }));
    } else {
      this.historialPeliculas = [];
    }
  }

  puedeCancelar(fechaFuncion: Date): boolean {
    const msDiferencia = fechaFuncion.getTime() - new Date().getTime();
    const horasDiferencia = msDiferencia / (1000 * 60 * 60);
    return horasDiferencia >= 2;
  }

  cancelarEntrada(ticket: TicketComprado) {
    if (!this.puedeCancelar(ticket.fechaFuncion)) {
      alert('Error: Ya no podés cancelar porque faltan menos de 2 horas para la función.');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro que querés cancelar tu entrada para ${ticket.titulo}? Se te acreditarán $ ${ticket.montoPagado} en tu cuenta.`);
    
    if (confirmacion) {
      ticket.estado = 'cancelada';
      this.miCreditoFavor += ticket.montoPagado;
      this.guardarCredito();
      this.actualizarStorage();
      alert(`¡Cancelación exitosa! Tu nuevo crédito a favor es de $ ${this.miCreditoFavor}`);
    }
  }

  calificar(pelicula: TicketComprado, estrellas: number) {
    pelicula.calificacionUsuario = estrellas;
    this.actualizarStorage();
    alert(`Guardaste tu calificación de ${estrellas} estrellas para ${pelicula.titulo}`);
  }

  guardarCredito() {
    if (this.isBrowser) {
      localStorage.setItem('credito_favor', JSON.stringify(this.miCreditoFavor));
    }
  }

  actualizarStorage() {
    if (this.isBrowser) {
      localStorage.setItem('historial_compras', JSON.stringify(this.historialPeliculas));
    }
  }
}