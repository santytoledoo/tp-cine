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
    this.router.navigate(['/ticket']);
  }
}