import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './peliculas.html',
  styleUrls: ['./peliculas.scss']
})
export class PeliculasComponent {
  peliculaForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    this.peliculaForm = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      duracion_minutos: ['', Validators.required],
      imagen_url: [''],
      formatos: ['2D, 3D', Validators.required], 
      idiomas: ['Castellano, Subtitulada', Validators.required],
      generos: ['Acción', Validators.required],
      restriccion_edad: ['ATP'],
      fecha_estreno: ['', Validators.required],
      precio_preventa: [0]
    });
  }

  async guardarPelicula() {
    if (this.peliculaForm.invalid) return;

    const datos = { ...this.peliculaForm.value };
    
    // Convertimos los textos separados por comas en listas (arrays) para la base de datos
    datos.formatos = datos.formatos.split(',').map((s: string) => s.trim());
    datos.idiomas = datos.idiomas.split(',').map((s: string) => s.trim());
    datos.generos = datos.generos.split(',').map((s: string) => s.trim());

    try {
      const { error } = await this.supabase.client.from('peliculas').insert(datos);
      if (error) throw error;

      this.mensaje = '¡Película guardada en la cartelera!';
      this.peliculaForm.reset({ restriccion_edad: 'ATP' });
    } catch (error: any) {
      this.mensaje = 'Error al guardar: ' + error.message;
    }
  }
}