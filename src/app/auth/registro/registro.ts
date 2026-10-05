import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private supabase: SupabaseService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', Validators.required],
      tipoSangre: ['', Validators.required],
      colorOjos: ['', Validators.required],
      diasVacaciones: [0, [Validators.required, Validators.min(0)]]
    });
  }

  async onSubmit() {
    if (this.registroForm.valid) {
      const datos = this.registroForm.value;
      try {
        // 1. Crear usuario real en Supabase Auth
        const { data, error } = await this.supabase.client.auth.signUp({
          email: datos.email,
          password: datos.password,
        });

        if (error) throw error;

        // 2. Guardar datos adicionales en localStorage de forma persistente e inmediata para el perfil
        if (data.user) {
          const perfilExtra = {
            nombre: datos.nombre,
            apellido: datos.apellido,
            fechaNacimiento: datos.fechaNacimiento,
            tipoSangre: datos.tipoSangre,
            colorOjos: datos.colorOjos,
            diasVacaciones: datos.diasVacaciones
          };
          localStorage.setItem(`perfil_extra_${data.user.id}`, JSON.stringify(perfilExtra));

          // 3. Intentar guardar datos adicionales en la tabla perfiles de Supabase
          try {
            await this.supabase.client.from('perfiles').insert({
              id: data.user.id,
              nombre: datos.nombre,
              apellido: datos.apellido,
              fecha_nacimiento: datos.fechaNacimiento,
              tipo_sangre: datos.tipoSangre,
              color_ojos: datos.colorOjos,
              dias_vacaciones: datos.diasVacaciones
            });
          } catch (profileErr) {
            console.warn('Tabla perfiles no creada aún, respaldado en localStorage.');
          }
        }

        this.mensajeExito = '¡Registro exitoso! Cuenta creada correctamente. Redirigiendo...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      } catch (err: any) {
        alert('Error al registrarse: ' + err.message);
      }
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}