import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.scss']
})
export class EscanerComponent {
  codigo: string = '';
  mensaje: string = '';
  ticketValido: any = null;
  cargando: boolean = false;

  constructor(
    private supabase: SupabaseService,
    private ngZone: NgZone
  ) {}

  async validarTicket() {
    const codigoBusqueda = this.codigo ? this.codigo.trim() : '';
    if (!codigoBusqueda || this.cargando) return;

    this.cargando = true;
    this.mensaje = 'Buscando ticket en la base de datos...';
    this.ticketValido = null;

    try {
      // 1. Consultar el ticket en Supabase
      const { data, error } = await this.supabase.client
        .from('entradas')
        .select('*')
        .eq('codigo_qr', codigoBusqueda)
        .maybeSingle();

      this.ngZone.run(() => {
        if (error) {
          this.mensaje = 'Error al consultar la base de datos: ' + error.message;
          this.cargando = false;
          return;
        }

        if (!data) {
          this.mensaje = `Error: El código "${codigoBusqueda}" no existe o es inválido.`;
          this.ticketValido = null;
          this.cargando = false;
          return;
        }

        // 2. Validar si el ticket ya fue utilizado
        if (data.estado !== 'activa') {
          this.mensaje = `⚠️ Atención: Este ticket ya fue ${data.estado} anteriormente.`;
          this.ticketValido = null;
          this.cargando = false;
          return;
        }
      });

      if (error || !data || data.estado !== 'activa') {
        return; // Si hubo error o no está activo, cortamos acá
      }

      // 3. Marcar el ticket como 'utilizada' en Supabase (INVALIDACIÓN DEL QR)
      const { error: updateError } = await this.supabase.client
        .from('entradas')
        .update({ estado: 'utilizada' })
        .eq('codigo_qr', codigoBusqueda);

      this.ngZone.run(() => {
        if (updateError) {
          this.mensaje = 'Error al actualizar el estado del ticket.';
          this.cargando = false;
          return;
        }

        // 4. Éxito total
        this.mensaje = '¡Acceso Permitido! Entrada validada correctamente.';
        this.ticketValido = {
          pelicula: data.pelicula,
          sala: data.sala,
          butacas: data.butacas,
          candybar: data.candybar
        };
        this.cargando = false;
        this.codigo = ''; // Limpiamos el input
      });

    } catch (err: any) {
      this.ngZone.run(() => {
        this.mensaje = 'Error inesperado: ' + (err.message || err);
        this.ticketValido = null;
        this.cargando = false;
      });
    }
  }
}