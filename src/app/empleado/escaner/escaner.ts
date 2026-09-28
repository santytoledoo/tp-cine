import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  validarTicket() {
    // Acá simulamos la validación en la base de datos
    if (this.codigo === 'UTN-CINE-987654321') {
      this.mensaje = '¡Acceso Permitido!';
      this.ticketValido = {
        pelicula: 'Deadpool & Wolverine',
        sala: '1',
        butacas: 'J5, J6',
        candybar: '1x Combo Mega (Pochoclo + 2 Bebidas)'
      };
    } else {
      this.mensaje = 'Error: Código inválido o entrada ya utilizada.';
      this.ticketValido = null;
    }
    
    // Limpiamos el campo para que el empleado pueda escanear al siguiente cliente al instante
    this.codigo = ''; 
  }
}