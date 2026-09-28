import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  // Datos estadísticos para el reporte
  totalRecaudado = 1250000;
  entradasVendidas = 350;
  combosVendidos = 120;

  // Ranking de películas (el porcentaje arma la barra gráfica)
  peliculasTop = [
    { titulo: 'Deadpool & Wolverine', ventas: 180, porcentaje: 85 },
    { titulo: 'Intensa Mente 2', ventas: 100, porcentaje: 50 },
    { titulo: 'Dune: Parte Dos', ventas: 70, porcentaje: 35 }
  ];
}