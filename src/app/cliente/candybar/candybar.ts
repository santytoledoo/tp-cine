import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candybar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candybar.html',
  styleUrls: ['./candybar.scss']
})
export class CandybarComponent {
  productos = [
    { nombre: 'Combo Mega (Pochoclo + 2 Bebidas)', precio: 8000, img: '🍿🥤' },
    { nombre: 'Pochoclo Grande', precio: 5000, img: '🍿' },
    { nombre: 'Gaseosa Grande', precio: 3000, img: '🥤' },
    { nombre: 'Nachos con Queso', precio: 4500, img: '🧀' }
  ];
  
  carrito: any[] = [];
  total = 0;

  constructor(private router: Router) {}

  agregarAlCarrito(prod: any) {
    this.carrito.push(prod);
    this.total += prod.precio;
  }

  finalizarCompra() {
    if (typeof window !== 'undefined') {
      const ticketParcial = JSON.parse(localStorage.getItem('ticket_parcial') || '{}');
      
      let descripcionCandy = 'Sin productos de Candy Bar';

      if (this.carrito.length > 0) {
        // Agrupar y contar cuántas veces se pidió cada producto
        const conteo: { [nombre: string]: number } = {};
        for (const item of this.carrito) {
          conteo[item.nombre] = (conteo[item.nombre] || 0) + 1;
        }

        // Formatear el texto (ej: "Pochoclo Grande x2", "Gaseosa Grande")
        const itemsAgrupados = Object.keys(conteo).map(nombre => {
          const cantidad = conteo[nombre];
          return cantidad > 1 ? `${nombre} x${cantidad}` : nombre;
        });

        descripcionCandy = itemsAgrupados.join(', ');
      }

      // Combinar con los datos de la función para el ticket
      const ticketFinal = {
        pelicula: ticketParcial.pelicula || 'Película General',
        sala: ticketParcial.sala || 'Sala 1',
        butacas: ticketParcial.butacas || 'Sin asientos',
        candybar: descripcionCandy
      };

      localStorage.setItem('ticket_final', JSON.stringify(ticketFinal));
    }

    this.router.navigate(['/ticket']);
  }
}