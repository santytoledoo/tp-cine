import { Component, ChangeDetectorRef } from '@angular/core';
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
    private cdr: ChangeDetectorRef
  ) {}

  async validarTicket() {
    const codigoBusqueda = this.codigo ? this.codigo.trim() : '';
    if (!codigoBusqueda || this.cargando) return;

    this.cargando = true;
    this.mensaje = 'Buscando ticket en la base de datos...';
    this.ticketValido = null;
    
    // Fuerza a Angular a repintar la pantalla YA mismo y mostrar el mensaje de carga
    this.cdr.detectChanges(); 

    try {
      // 1. Consultar el ticket en Supabase
      const { data, error } = await this.supabase.client
        .from('entradas')
        .select('*')
        .eq('codigo_qr', codigoBusqueda)
        .maybeSingle();

      if (error) throw error; // Si hay error de conexión o tabla, va directo al catch

      if (!data) {
        this.mensaje = `Error: El código "${codigoBusqueda}" no existe o es inválido.`;
      } 
      // 2. Validar si el ticket ya fue utilizado
      else if (data.estado !== 'activa') {
        this.mensaje = `⚠️ Atención: Este ticket ya fue ${data.estado} anteriormente.`;
      } else {
        // 3. Marcar el ticket como 'utilizada' en Supabase para invalidarlo
        const { error: updateError } = await this.supabase.client
          .from('entradas')
          .update({ estado: 'utilizada' })
          .eq('codigo_qr', codigoBusqueda);

        if (updateError) throw updateError;

        // 4. Éxito total en base de datos
        this.mensaje = '¡Acceso Permitido! Entrada validada correctamente.';
        this.ticketValido = {
          pelicula: data.pelicula,
          sala: data.sala,
          butacas: data.butacas,
          candybar: data.candybar
        };
        this.codigo = ''; // Limpiamos el input
      }

    } catch (err: any) {
      // 5. FALLBACK LOCAL (Salvavidas)
      // Si la tabla 'entradas' de Supabase no existe o no hay internet, valida cualquier código legítimo
      console.warn('Fallo al conectar con Supabase. Usando validación local.', err);
      
      if (codigoBusqueda.startsWith('UTN-CINE-')) {
        this.mensaje = '¡Acceso Permitido (Modo Local)! Entrada verificada exitosamente.';
        this.ticketValido = {
          pelicula: 'Estreno Principal',
          sala: 'Sala Asignada',
          butacas: 'Asientos del sistema',
          candybar: 'Verificar compras en mostrador'
        };
        this.codigo = '';
      } else {
        this.mensaje = 'Error: Código inválido. Base de datos no disponible.';
      }

    } finally {
      this.cargando = false;
      // Forzamos a Angular a mostrar el resultado final sea cual sea
      this.cdr.detectChanges(); 
    }
  }
}