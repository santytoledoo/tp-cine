import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FidelizacionService } from '../../core/services/fidelizacion';

@Component({
  selector: 'app-candybar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candybar.html',
  styleUrls: ['./candybar.scss']
})
export class CandybarComponent implements OnInit {
  productos = [
    { nombre: 'Pochoclo Grande', precio: 5000, img: '🍿' },
    { nombre: 'Gaseosa Grande', precio: 3000, img: '🥤' },
    { nombre: 'Nachos con Queso', precio: 4500, img: '🧀' }
  ];

  combosEspeciales: any[] = [];
  carrito: any[] = [];
  total = 0;

  constructor(
    private router: Router,
    private fidelizacionService: FidelizacionService
  ) {}

  ngOnInit() {
    this.combosEspeciales = this.fidelizacionService.getCombosEspeciales();
  }

  agregarAlCarrito(prod: any) {
    this.carrito.push(prod);
    this.total += prod.precio;
  }

  agregarCombo(combo: any) {
    this.carrito.push({
      nombre: combo.nombre,
      precio: combo.precio
    });
    this.total += combo.precio;
  }

  finalizarCompra() {
    if (typeof window !== 'undefined') {
      const ticketParcial = JSON.parse(localStorage.getItem('ticket_parcial') || '{}');
      
      let descripcionCandy = 'Sin productos de Candy Bar';

      if (this.carrito.length > 0) {
        const conteo: { [nombre: string]: number } = {};
        for (const item of this.carrito) {
          conteo[item.nombre] = (conteo[item.nombre] || 0) + 1;
        }

        const itemsAgrupados = Object.keys(conteo).map(nombre => {
          const cantidad = conteo[nombre];
          return cantidad > 1 ? `${nombre} x${cantidad}` : nombre;
        });

        descripcionCandy = itemsAgrupados.join(', ');
      }

      // Sumar el precio de las entradas + el total del candy bar
      const precioEntradas = ticketParcial.precioEntradas || 6000;
      const montoTotalPagado = precioEntradas + this.total;

      const ticketFinal = {
        pelicula: ticketParcial.pelicula || 'Película General',
        sala: ticketParcial.sala || 'Sala 1',
        butacas: ticketParcial.butacas || 'Sin asientos',
        candybar: descripcionCandy,
        montoPagado: montoTotalPagado
      };

      localStorage.setItem('ticket_final', JSON.stringify(ticketFinal));
    }

    this.router.navigate(['/ticket']);
  }
}