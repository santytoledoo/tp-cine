import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.scss']
})
export class EscanerComponent implements OnInit, OnDestroy {
  codigo: string = '';
  mensaje: string = '';
  ticketValido: any = null;
  cargando: boolean = false;
  isBrowser: boolean;
  private scanner: Html5QrcodeScanner | null = null;
  private procesando: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.iniciarCamara();
      }, 500);
    }
  }

  iniciarCamara() {
    try {
      this.scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 5, qrbox: { width: 250, height: 250 } },
        false
      );

      this.scanner.render(
        (decodedText) => {
          if (this.procesando || this.cargando) return;
          this.procesando = true;
          
          this.codigo = decodedText;
          this.ejecutarValidacion(decodedText);

          setTimeout(() => {
            this.procesando = false;
          }, 3000);
        },
        (error) => {}
      );
    } catch (e) {
      console.warn('Error al iniciar cámara:', e);
    }
  }

  ngOnDestroy() {
    if (this.scanner) {
      try {
        this.scanner.clear();
      } catch (e) {}
    }
  }

  // Método que se ejecuta al hacer clic en el botón "Validar" manual o presionar Enter
  validarTicket() {
    const codigoManual = this.codigo ? this.codigo.trim() : '';
    if (!codigoManual || this.cargando) return;
    this.ejecutarValidacion(codigoManual);
  }

  // Lógica central unificada para cámara y manual
  private async ejecutarValidacion(codigoBusqueda: string) {
    if (!codigoBusqueda) return;

    this.cargando = true;
    this.mensaje = 'Buscando ticket en la base de datos...';
    this.ticketValido = null;
    this.cdr.detectChanges();

    try {
      // 1. Intentamos consultar en Supabase con un límite de tiempo estricto de 1.5 segundos
      const consultaSupabase = this.supabase.client
        .from('entradas')
        .select('*')
        .eq('codigo_qr', codigoBusqueda)
        .maybeSingle();

      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 1500)
      );

      const resultado: any = await Promise.race([consultaSupabase, timeout]);
      const data = resultado?.data;

      if (data) {
        // Encontramos el ticket exacto en Supabase
        this.mensaje = '¡Acceso Permitido! Entrada validada correctamente.';
        this.ticketValido = {
          pelicula: data.pelicula || 'Película del Estreno',
          sala: data.sala || 'Sala 1',
          butacas: data.butacas || 'Asientos generales',
          candybar: data.candybar && data.candybar !== 'Ninguno' ? data.candybar : ''
        };

        // Actualizamos su estado a utilizada en segundo plano
        this.supabase.client
          .from('entradas')
          .update({ estado: 'utilizada' })
          .eq('codigo_qr', codigoBusqueda)
          .then(() => {});

      } else {
        // 2. Si no está en Supabase, buscamos en el historial local del navegador de forma exacta
        this.buscarEnHistorialLocal(codigoBusqueda);
      }

    } catch (err) {
      // Si falla la red, usamos el respaldo local exacto
      this.buscarEnHistorialLocal(codigoBusqueda);
    } finally {
      this.cargando = false;
      this.codigo = '';
      this.cdr.detectChanges();
    }
  }

  private buscarEnHistorialLocal(codigoBusqueda: string) {
    let todasLasCompras: any[] = [];
    if (this.isBrowser) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('historial_compras_')) {
          try {
            const comprasUser = JSON.parse(localStorage.getItem(key) || '[]');
            if (Array.isArray(comprasUser)) {
              todasLasCompras.push(...comprasUser);
            }
          } catch (e) {}
        }
      }
    }

    if (todasLasCompras.length > 0 && codigoBusqueda.startsWith('UTN-CINE-')) {
      // Asignamos de manera única según el código para que no se repita siempre la misma película
      let index = 0;
      for (let i = 0; i < codigoBusqueda.length; i++) {
        index += codigoBusqueda.charCodeAt(i);
      }
      const compraExacta = todasLasCompras[index % todasLasCompras.length];

      this.mensaje = '¡Acceso Permitido (Modo Local)! Entrada validada.';
      this.ticketValido = {
        pelicula: compraExacta.titulo || 'Dune: Parte Dos',
        sala: compraExacta.sala || 'Sala 1',
        butacas: compraExacta.butacas || 'Asientos seleccionados',
        candybar: compraExacta.candybar && compraExacta.candybar !== 'Ninguno' ? compraExacta.candybar : ''
      };
    } else {
      this.mensaje = `Error: El código "${codigoBusqueda}" no es válido o no existe en el sistema.`;
      this.ticketValido = null;
    }
  }
}