import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink, QRCodeComponent],
  template: `
    <div class="ticket-page">
      <div class="ticket-card">
        <div class="ticket-header">
          <h2>UTN CINEMAS</h2>
          <span class="badge-entrada">ENTRADA OFICIAL</span>
        </div>

        <div class="ticket-body">
          <h3>¡Tu Entrada de Cine!</h3>
          <p class="subtext">Presenta este código QR en el ingreso de la sala.</p>

          <div class="qr-wrapper">
            @if (isBrowser && miTextoParaElQr) {
              <qrcode 
                [qrdata]="miTextoParaElQr" 
                [width]="200" 
                [errorCorrectionLevel]="'M'">
              </qrcode>
            } @else {
              <p class="loading-qr">{{ mensajeCarga }}</p>
            }
          </div>

          <div class="ticket-info">
            <div class="info-row codigo-row">
              <span>Código:</span>
              <strong class="codigo-texto">{{ miTextoParaElQr }}</strong>
            </div>
            <div class="info-row">
              <span>Película:</span>
              <strong>{{ detalleFuncion.pelicula }}</strong>
            </div>
            <div class="info-row">
              <span>Sala:</span>
              <strong>{{ detalleFuncion.sala }}</strong>
            </div>
            <div class="info-row">
              <span>Asientos:</span>
              <strong>{{ detalleFuncion.butacas }}</strong>
            </div>
            <div class="info-row" *ngIf="detalleFuncion.candybar">
              <span>Candy Bar:</span>
              <strong>{{ detalleFuncion.candybar }}</strong>
            </div>
            <div class="info-row" style="border-top: 1px solid #2f3542; padding-top: 5px; margin-top: 5px;">
              <span>Total Pagado:</span>
              <strong style="color: #2ed573;">$ {{ detalleFuncion.montoPagado }}</strong>
            </div>
          </div>
        </div>

        <div class="ticket-footer">
          <a routerLink="/home" class="btn-volver">Volver al Inicio</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket-page { background-color: #0f0f1a; color: #ffffff; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .ticket-card { background: #1a1a2e; width: 100%; max-width: 420px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border: 1px solid #2f3542; display: flex; flex-direction: column; }
    .ticket-header { background: #141421; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #2f3542; h2 { margin: 0; color: #e94560; font-size: 1.25rem; letter-spacing: 1px; } .badge-entrada { background-color: #e94560; color: white; font-size: 0.7rem; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; } }
    .ticket-body { padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; h3 { margin: 0; font-size: 1.4rem; color: #ffffff; } .subtext { margin: 0; color: #a4b0be; font-size: 0.85rem; }
      .qr-wrapper { background: #ffffff; padding: 1rem; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); margin: 0.5rem 0; display: flex; justify-content: center; align-items: center; .loading-qr { color: #2f3542; font-size: 0.9rem; margin: 0; } }
      .ticket-info { width: 100%; background: #141421; padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.5rem; text-align: left; .info-row { display: flex; justify-content: space-between; font-size: 0.9rem; span { color: #a4b0be; } strong { color: #ffffff; text-align: right; max-width: 60%; } &.codigo-row { border-bottom: 1px dashed #2f3542; padding-bottom: 0.5rem; margin-bottom: 0.2rem; .codigo-texto { color: #fbc531; font-family: monospace; font-size: 0.95rem; letter-spacing: 0.5px; } } } } }
    .ticket-footer { padding: 1rem 2rem 2rem 2rem; text-align: center; .btn-volver { display: block; background-color: #e94560; color: white; text-align: center; padding: 0.85rem; border-radius: 8px; text-decoration: none; font-weight: bold; transition: background 0.2s; &:hover { background-color: #d63031; } } }
  `]
})
export class TicketComponent implements OnInit {
  isBrowser: boolean;
  miTextoParaElQr: string = '';
  mensajeCarga: string = 'Generando código QR...';
  
  detalleFuncion = {
    pelicula: 'Cargando...',
    sala: 'Cargando...',
    butacas: 'Cargando...',
    candybar: '',
    montoPagado: 0
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      
      const ticketGuardado = localStorage.getItem('ticket_final');
      let montoReal = 6000;

      if (ticketGuardado) {
        const datos = JSON.parse(ticketGuardado);
        montoReal = datos.montoPagado || 6000;
        this.detalleFuncion = {
          pelicula: datos.pelicula || 'Película General',
          sala: datos.sala || 'Sala 1',
          butacas: datos.butacas || 'Sin asientos',
          candybar: datos.candybar || 'Ninguno',
          montoPagado: montoReal
        };
      }

      const codigoUnico = 'UTN-CINE-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      this.miTextoParaElQr = codigoUnico;
      
      this.cdr.detectChanges(); // Fuerza a Angular a mostrar el ticket YA.

      // 2. GUARDAR EN BASE DE DATOS EN SEGUNDO PLANO
      this.procesarFidelizacionYBaseDeDatos(montoReal, codigoUnico);
    }
  }

  async procesarFidelizacionYBaseDeDatos(montoReal: number, codigoUnico: string) {
    let userId = 'invitado'; 
    try {
      const { data } = await this.supabase.client.auth.getSession();
      if (data.session?.user) {
        userId = data.session.user.id;
      }
    } catch (e) { }

    const historialKey = `historial_compras_${userId}`;
    const historial = JSON.parse(localStorage.getItem(historialKey) || '[]');
    const yaExiste = historial.some((h: any) => h.butacas === this.detalleFuncion.butacas && h.titulo === this.detalleFuncion.pelicula);
    
    if (!yaExiste) {
      historial.unshift({
        id: Date.now(),
        titulo: this.detalleFuncion.pelicula,
        fechaFuncion: new Date(new Date().getTime() + 6 * 60 * 60 * 1000).toISOString(),
        sala: this.detalleFuncion.sala,
        butacas: this.detalleFuncion.butacas,
        candybar: this.detalleFuncion.candybar,
        poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=200',
        calificacionUsuario: 0,
        comentario: '',
        estado: 'activa',
        montoPagado: montoReal
      });
      localStorage.setItem(historialKey, JSON.stringify(historial));

      if (userId !== 'invitado') {
        const puntosKey = `puntos_${userId}`;
        const puntosActuales = Number(localStorage.getItem(puntosKey) || '0');
        const puntosGanados = Math.floor(montoReal * 1);
        localStorage.setItem(puntosKey, (puntosActuales + puntosGanados).toString());
      }
    }

    try {
      await this.supabase.client.from('entradas').insert({
        codigo_qr: codigoUnico,
        pelicula: this.detalleFuncion.pelicula,
        sala: this.detalleFuncion.sala,
        butacas: this.detalleFuncion.butacas,
        candybar: this.detalleFuncion.candybar,
        estado: 'activa'
      });
    } catch (err) { }
  }
}