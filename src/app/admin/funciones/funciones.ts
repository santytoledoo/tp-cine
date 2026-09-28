import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-funciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './funciones.html',
  styleUrls: ['./funciones.scss']
})
export class FuncionesComponent implements OnInit {
  funcionForm: FormGroup;
  peliculas: any[] = [];
  salas: any[] = [];
  mensaje: string = '';

  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    this.funcionForm = this.fb.group({
      pelicula_id: ['', Validators.required],
      fecha: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      precio_base: [5000, Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    // Traemos las películas para el desplegable
    const { data: pelis } = await this.supabase.client.from('peliculas').select('id, titulo, duracion_minutos');
    if (pelis) this.peliculas = pelis;

    // Traemos las salas físicas
    const { data: salasCine } = await this.supabase.client.from('salas').select('*');
    if (salasCine) this.salas = salasCine;
  }

  async programarFuncion() {
    if (this.funcionForm.invalid) return;
    
    const datos = this.funcionForm.value;
    const pelicula = this.peliculas.find(p => p.id === datos.pelicula_id);
    
    // 1. Calcular hora de fin sumando la duración en minutos
    const [horasStr, minStr] = datos.hora_inicio.split(':');
    let fechaInicio = new Date(`1970-01-01T${horasStr}:${minStr}:00`);
    
    // Sumamos la duración de la película
    let fechaFin = new Date(fechaInicio.getTime() + pelicula.duracion_minutos * 60000);
    let horaFinStr = fechaFin.toTimeString().substring(0, 5);

    // Sumamos 30 minutos obligatorios para limpieza antes de la próxima función
    let fechaFinConLimpieza = new Date(fechaFin.getTime() + 30 * 60000);
    let horaFinLimpiezaStr = fechaFinConLimpieza.toTimeString().substring(0, 5);

    try {
      // 2. Traer las funciones de ese mismo día para ver qué salas están ocupadas
      const { data: funcionesDelDia } = await this.supabase.client
        .from('funciones')
        .select('sala_id, hora_inicio, hora_fin')
        .eq('fecha', datos.fecha);

      // 3. Buscar una sala libre comparando horarios
      let salaAsignadaId = null;

      for (let sala of this.salas) {
        let ocupada = false;
        
        if (funcionesDelDia) {
          for (let func of funcionesDelDia) {
            if (func.sala_id === sala.id) {
              // Si el inicio o el fin (+ limpieza) choca con otra función, está ocupada
              if (
                (datos.hora_inicio >= func.hora_inicio && datos.hora_inicio <= func.hora_fin) ||
                (horaFinLimpiezaStr >= func.hora_inicio && horaFinLimpiezaStr <= func.hora_fin) ||
                (datos.hora_inicio <= func.hora_inicio && horaFinLimpiezaStr >= func.hora_fin)
              ) {
                ocupada = true;
                break;
              }
            }
          }
        }

        if (!ocupada) {
          salaAsignadaId = sala.id;
          break; // Encontramos sala, cortamos la búsqueda
        }
      }

      if (!salaAsignadaId) {
        this.mensaje = 'Error: No hay salas disponibles en ese horario (recordá la ventana de 30 min).';
        return;
      }

      // 4. Guardar la función en la sala libre encontrada
      const nuevaFuncion = {
        pelicula_id: datos.pelicula_id,
        sala_id: salaAsignadaId,
        fecha: datos.fecha,
        hora_inicio: datos.hora_inicio,
        hora_fin: horaFinStr,
        precio_base: datos.precio_base
      };

      const { error } = await this.supabase.client.from('funciones').insert(nuevaFuncion);
      if (error) throw error;

      const salaAsignada = this.salas.find(s => s.id === salaAsignadaId);
      this.mensaje = `¡Éxito! Se asignó automáticamente a la SALA ${salaAsignada.numero}. Termina a las ${horaFinStr}.`;
      
    } catch (error: any) {
      this.mensaje = 'Error al programar: ' + error.message;
    }
  }
}