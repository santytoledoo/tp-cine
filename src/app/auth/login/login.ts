import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder, 
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async iniciarSesion() {
    if (this.loginForm.invalid) return;

    const datos = this.loginForm.value;

    try {
      const { error } = await this.supabase.client.auth.signInWithPassword({
        email: datos.email,
        password: datos.password,
      });

      if (error) throw error;

      this.mensaje = '¡Ingreso exitoso!';
      // Más adelante acá pondremos la redirección al Home o al Panel de Admin
      
    } catch (error: any) {
      this.mensaje = 'Error al iniciar sesión: ' + error.message;
    }
  }
}