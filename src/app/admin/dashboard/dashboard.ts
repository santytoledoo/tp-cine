import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { CuponService } from '../../core/services/cupon';
import { FidelizacionService } from '../../core/services/fidelizacion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  template: `
    <div class="dashboard-container">
      <div class="header-admin">
        <h2>Panel de Control - UTN Cinemas</h2>
        <div class="botones-exportar">
          <button class="btn-pdf" (click)="exportarPDF()">📄 Exportar PDF</button>
          <button class="btn-excel" (click)="exportarExcel()">📊 Exportar Excel</button>
        </div>
      </div>
      
      <p>Reportes de ventas, métricas generales y configuración del sistema.</p>

      <!-- TARJETAS DE MÉTRICAS -->
      <div class="tarjetas-grid">
        <div class="tarjeta">
          <div class="icono">💰</div>
          <div class="info">
            <h3>Facturación Diaria</h3>
            <p class="numero">$ {{ facturacionDiaria | number:'1.0-0' }}</p>
          </div>
        </div>
        
        <div class="tarjeta">
          <div class="icono">🎟️</div>
          <div class="info">
            <h3>Entradas Vendidas</h3>
            <p class="numero">{{ entradasVendidas }}</p>
          </div>
        </div>
        
        <div class="tarjeta">
          <div class="icono">🍿</div>
          <div class="info">
            <h3>Candy Top Ventas</h3>
            <p class="numero-texto">{{ productoCandyTop.nombre }}</p>
            <p class="subtexto">{{ productoCandyTop.ventas }} unidades</p>
          </div>
        </div>
      </div>

      <!-- SECCIÓN DE CONFIGURACIÓN DEL ADMIN -->
      <div class="config-admin-box">
        <h3>⚙️ Configuración del Sistema (Cupones y Fidelización)</h3>
        <p class="config-desc">Modificá en tiempo real las reglas de descuento y costos de puntos exigidas por la administración.</p>
        
        <div class="config-grid">
          <div class="config-item">
            <label>Porcentaje Cupón Primera Compra (% OFF):</label>
            <input type="number" [(ngModel)]="porcentajePrimeraCompraConfig" min="1" max="100">
          </div>
          
          <div class="config-item">
            <label>Costo Entrada en Puntos:</label>
            <input type="number" [(ngModel)]="costoEntradaPuntosConfig" min="10">
          </div>

          <div class="config-item">
            <label>Costo Pochoclo Grande en Puntos:</label>
            <input type="number" [(ngModel)]="costoCandyPuntosConfig" min="10">
          </div>
        </div>

        <button class="btn-guardar-config" (click)="guardarConfiguracion()">💾 Guardar Cambios de Configuración</button>
        <p *ngIf="mensajeConfig" class="mensaje-exito-config">{{ mensajeConfig }}</p>
      </div>

      <div class="paneles-inferiores">
        <!-- GRÁFICO DE BARRAS: PELÍCULAS MÁS VISTAS -->
        <div class="graficos-container">
          <h3>Películas Más Vistas (Semana)</h3>
          <div class="ranking">
            <div class="item-ranking" *ngFor="let p of peliculasTop">
              <div class="datos">
                <span class="titulo">{{ p.titulo }}</span>
                <span class="ventas">{{ p.ventas }} tickets</span>
              </div>
              <div class="barra-fondo">
                <div class="barra-progreso" [style.width.%]="p.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- LOG DE AUDITORÍA -->
        <div class="log-container">
          <h3>Log de Actividad</h3>
          <div class="lista-log">
            <div class="log-item" *ngFor="let log of logActividad">
              <div class="log-fecha">{{ log.fecha | date:'dd/MM/yyyy HH:mm' }}</div>
              <div class="log-detalle">
                <strong>{{ log.usuario }}</strong> {{ log.accion }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 40px 5%; background-color: #0f0f1a; color: white; min-height: 100vh; font-family: sans-serif;
    }
    .header-admin {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 10px;
    }
    h2 { color: #e94560; margin: 0; font-size: 2rem; }
    p { color: #a4b0be; margin-bottom: 30px; }
    
    .botones-exportar { display: flex; gap: 15px; }
    .btn-pdf { background-color: #e50914; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    .btn-pdf:hover { background-color: #b20710; }
    .btn-excel { background-color: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    .btn-excel:hover { background-color: #219150; }

    .tarjetas-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;
    }
    .tarjeta {
      background-color: #1a1a2e; border-radius: 10px; padding: 25px; display: flex; align-items: center; gap: 20px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3); border-left: 5px solid #e94560; border: 1px solid #2f3542;
    }
    .tarjeta .icono { font-size: 3rem; }
    .tarjeta .info h3 { margin: 0 0 5px 0; font-size: 1rem; color: #a4b0be; text-transform: uppercase; }
    .tarjeta .info .numero { margin: 0; font-size: 2rem; font-weight: bold; color: #fff; }
    .tarjeta .info .numero-texto { margin: 0; font-size: 1.4rem; font-weight: bold; color: #fbc531; }
    .tarjeta .info .subtexto { margin: 0; font-size: 0.9rem; color: #ccc; }

    .config-admin-box {
      background-color: #1a1a2e; padding: 25px; border-radius: 10px; border: 1px solid #2ed573; margin-bottom: 40px;
      box-shadow: 0 4px 15px rgba(46, 213, 115, 0.1);
      h3 { color: #2ed573; margin-top: 0; margin-bottom: 5px; font-size: 1.3rem; border-bottom: 1px solid #2f3542; padding-bottom: 10px; }
      .config-desc { color: #a4b0be; font-size: 0.9rem; margin-bottom: 20px; }
    }
    .config-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;
    }
    .config-item {
      display: flex; flex-direction: column; gap: 8px;
      label { font-size: 0.9rem; color: #fff; font-weight: 600; }
      input {
        background-color: #141421; border: 1px solid #2f3542; color: white; padding: 10px; border-radius: 6px; font-size: 1rem; outline: none;
        &:focus { border-color: #2ed573; }
      }
    }
    .btn-guardar-config {
      background-color: #2ed573; color: #1a1a2e; border: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer;
      &:hover { background-color: #26b360; }
    }
    .mensaje-exito-config { color: #2ed573; font-weight: bold; margin-top: 10px; }

    .paneles-inferiores {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px;
    }

    .graficos-container, .log-container {
      background-color: #1a1a2e; padding: 30px; border-radius: 10px; border: 1px solid #2f3542; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    h3 { margin-top: 0; margin-bottom: 25px; font-size: 1.3rem; border-bottom: 1px solid #2f3542; padding-bottom: 10px; color: #fff; }

    .ranking { display: flex; flex-direction: column; gap: 20px; }
    .item-ranking .datos { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .item-ranking .titulo { font-weight: bold; font-size: 1.1rem; }
    .item-ranking .ventas { color: #2ed573; font-weight: bold; }
    .barra-fondo { width: 100%; height: 12px; background-color: #141421; border-radius: 10px; overflow: hidden; border: 1px solid #2f3542; }
    .barra-progreso { height: 100%; background-color: #e94560; border-radius: 10px; transition: width 1s ease-in-out; }

    .lista-log { display: flex; flex-direction: column; gap: 15px; max-height: 300px; overflow-y: auto; padding-right: 10px;}
    .lista-log::-webkit-scrollbar { width: 6px; }
    .lista-log::-webkit-scrollbar-thumb { background: #2f3542; border-radius: 10px; }
    .log-item { background: #141421; padding: 12px; border-radius: 6px; border-left: 4px solid #fbc531; font-size: 0.9rem; }
    .log-fecha { color: #a4b0be; font-size: 0.8rem; margin-bottom: 4px; }
    .log-detalle strong { color: #e94560; }
  `]
})
export class DashboardComponent implements OnInit {
  facturacionDiaria = 1250000;
  entradasVendidas = 350;
  productoCandyTop = { nombre: 'Combo Mega', ventas: 184 };

  porcentajePrimeraCompraConfig: number = 20;
  costoEntradaPuntosConfig: number = 500;
  costoCandyPuntosConfig: number = 150;
  mensajeConfig: string = '';

  peliculasTop = [
    { titulo: 'Deadpool & Wolverine', ventas: 180, porcentaje: 85 },
    { titulo: 'Intensa Mente 2', ventas: 100, porcentaje: 50 },
    { titulo: 'Dune: Parte Dos', ventas: 70, porcentaje: 35 }
  ];

  logActividad = [
    { fecha: new Date(), usuario: 'AdminSanty', accion: 'Exportó reporte de facturación a Excel.' },
    { fecha: new Date(new Date().getTime() - 1000 * 60 * 30), usuario: 'EmpleadoJuan', accion: 'Validó código QR para Sala 1 (Butacas J5, J6).' },
    { fecha: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), usuario: 'AdminSanty', accion: 'Creó nueva función para Misión Imposible 8.' }
  ];

  constructor(
    private datePipe: DatePipe,
    private cuponService: CuponService,
    private fidelizacionService: FidelizacionService
  ) {}

  ngOnInit() {
    this.porcentajePrimeraCompraConfig = this.cuponService.getPorcentajePrimeraCompra();
  }

  guardarConfiguracion() {
    this.cuponService.setPorcentajePrimeraCompra(Number(this.porcentajePrimeraCompraConfig));
    this.fidelizacionService.actualizarCostos(Number(this.costoEntradaPuntosConfig), Number(this.costoCandyPuntosConfig));

    this.mensajeConfig = '¡Configuración actualizada correctamente en todo el sistema!';
    this.registrarAccion(`Modificó la configuración de cupones (${this.porcentajePrimeraCompraConfig}% OFF) y puntos.`);

    setTimeout(() => {
      this.mensajeConfig = '';
    }, 4000);
  }

  exportarPDF() {
    const doc = new jsPDF();
    const fechaActual = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

    doc.setFontSize(22);
    doc.setTextColor(233, 69, 96);
    doc.text('UTN Cinemas - Reporte de Facturación', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha de emisión: ${fechaActual}`, 20, 30);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(14);
    doc.text(`Recaudación del día: $ ${this.facturacionDiaria}`, 20, 50);
    doc.text(`Entradas totales vendidas: ${this.entradasVendidas}`, 20, 60);
    doc.text(`Producto de Candy más vendido: ${this.productoCandyTop.nombre} (${this.productoCandyTop.ventas} unid.)`, 20, 70);

    doc.save('Reporte_Facturacion_UTNCinemas.pdf');
    this.registrarAccion('Exportó reporte de facturación a PDF.');
  }

  exportarExcel() {
    const datosReporte = [
      { Metrica: 'Facturación Diaria ($)', Valor: this.facturacionDiaria },
      { Metrica: 'Entradas Vendidas', Valor: this.entradasVendidas },
      { Metrica: 'Producto Top Candy Bar', Valor: this.productoCandyTop.nombre },
      { Metrica: 'Unidades Vendidas Candy Top', Valor: this.productoCandyTop.ventas }
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosReporte);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    
    XLSX.writeFile(workbook, 'Reporte_Facturacion_UTNCinemas.xlsx');
    this.registrarAccion('Exportó reporte de facturación a Excel.');
  }

  private registrarAccion(accion: string) {
    this.logActividad.unshift({
      fecha: new Date(),
      usuario: 'AdminSanty',
      accion: accion
    });
  }
}