import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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

  onSubmit() {
    if (this.registroForm.valid) {
      console.log('Datos de registro:', this.registroForm.value);
      // Aquí guardarías los datos en Supabase y aplicarías el cupón del 20% de descuento en primera compra
      this.mensajeExito = '¡Registro exitoso! Se aplicó tu cupón de 20% de descuento para tu primera compra.';
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}