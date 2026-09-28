import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-butacas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './butacas.html',
  styleUrls: ['./butacas.scss']
})
export class ButacasComponent implements OnInit {
  filas: any[] = [];
  letras = 'ABCDEFGHIJKLMNOPQRST'.split('');

  constructor(private router: Router) {}

  ngOnInit() {
    this.generarMapa();
  }

  generarMapa() {
    this.filas = this.letras.map(letra => {
      let tipo = 'normal';
      let estructura = [4, 20, 4];

      if (letra === 'J' || letra === 'K') {
        tipo = 'accesible';
        estructura = [2, 10, 2];
      } else if (letra === 'R' || letra === 'S' || letra === 'T') {
        tipo = 'vip';
      }

      return {
        letra: letra,
        tipo: tipo,
        bloques: estructura.map(cant => this.crearBloque(cant))
      };
    });
  }

  crearBloque(cantidad: number) {
    return Array(cantidad).fill(0).map(() => ({ estado: 'libre' }));
  }

  seleccionarButaca(butaca: any, tipoFila: string) {
    if (butaca.estado === 'ocupada') return;

    if (butaca.estado === 'libre') {
      if (tipoFila === 'vip') {
        alert('Atención: Estás seleccionando una butaca VIP. Tiene un costo superior a la entrada normal.');
      }
      butaca.estado = 'seleccionada';
    } else {
      butaca.estado = 'libre'; 
    }
  }

  // Acá está la función conectada al botón
  irAlCandyBar() {
    this.router.navigate(['/candybar']);
  }
}