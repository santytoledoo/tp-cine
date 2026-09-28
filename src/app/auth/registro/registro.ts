import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      tipo_sangre: [''],
      color_ojos: [''],
      dias_vacaciones: [0, Validators.min(0)]
    });
  }

  async registrar() {
    if (this.registroForm.invalid) {
      this.mensaje = 'Por favor, revisá los campos obligatorios.';
      return;
    }

    const datos = this.registroForm.value;

    try {
      const { data: authData, error: authError } = await this.supabase.client.auth.signUp({
        email: datos.email,
        password: datos.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: perfilError } = await this.supabase.client
          .from('perfiles')
          .insert({
            id: authData.user.id,
            nombre: datos.nombre,
            apellido: datos.apellido,
            fecha_nacimiento: datos.fecha_nacimiento,
            tipo_sangre: datos.tipo_sangre,
            color_ojos: datos.color_ojos,
            dias_vacaciones: datos.dias_vacaciones,
            rol: 'cliente'
          });

        if (perfilError) throw perfilError;

        this.mensaje = '¡Registro exitoso! Ya podés iniciar sesión.';
        this.registroForm.reset();
      }
    } catch (error: any) {
      this.mensaje = 'Error al registrar: ' + error.message;
    }
  }
}