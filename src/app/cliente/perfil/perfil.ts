import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
  usuario = {
    nombre: 'Carlos',
    apellido: 'Martínez',
    email: 'carlos@utn.edu.ar',
    puntos: 1250, // Puntos acumulados (1 punto por cada peso gastado)
    creditoFavor: 4500, // Crédito acumulado por cancelaciones hasta 2 horas antes
    esPrimeraCompra: false,
    edad: 28
  };

  historialCanjes = [
    { fecha: '20/08/2026', recompensa: '1x Entrada Gratis', puntosGastados: 500 },
    { fecha: '05/09/2026', recompensa: '1x Pochoclo Grande', puntosGastados: 150 }
  ];

  constructor() {}

  ngOnInit() {}
}