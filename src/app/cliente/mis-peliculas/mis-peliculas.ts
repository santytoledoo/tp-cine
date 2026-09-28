import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-peliculas.html',
  styleUrls: ['./mis-peliculas.scss']
})
export class MisPeliculasComponent implements OnInit {
  historialPeliculas = [
    {
      titulo: 'Deadpool & Wolverine',
      fecha: '15/08/2026',
      sala: 'Sala 2',
      poster: 'https://image.tmdb.org/t/p/original/8cdWjvZQUrmU311RscMhkli041.jpg',
      calificacionUsuario: 5,
      comentario: '¡Increíble, la mejor del año!'
    },
    {
      titulo: 'Intensa Mente 2',
      fecha: '02/09/2026',
      sala: 'Sala 4',
      poster: 'https://image.tmdb.org/t/p/original/m1MibxWqT8R056jQpPjKzI1tT5U.jpg',
      calificacionUsuario: 4,
      comentario: 'Muy emotiva y divertida.'
    }
  ];

  constructor() {}

  ngOnInit() {}

  calificar(pelicula: any, estrellas: number) {
    pelicula.calificacionUsuario = estrellas;
    alert(`Guardaste tu calificación de ${estrellas} estrellas para ${pelicula.titulo}`);
  }
}