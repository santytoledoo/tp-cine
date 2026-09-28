import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resenias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resenias.html',
  styleUrls: ['./resenias.scss']
})
export class ReseniasComponent {
  @Input() peliculaId: number = 1;
  
  promedio: number = 4.5;
  resenias = [
    { usuario: 'Carlos M.', estrellas: 5, comentario: '¡Excelente película, efectos increíbles!' },
    { usuario: 'Lucía G.', estrellas: 4, comenario: 'Muy entretenida, vale la pena verla en sala grande.' }
  ];

  nuevaEstrella: number = 5;
  nuevoComentario: string = '';

  agregarResenia() {
    if (!this.nuevoComentario.trim()) return;
    
    this.resenias.unshift({
      usuario: 'Vos (Usuario Actual)',
      estrellas: Number(this.nuevaEstrella),
      comentario: this.nuevoComentario
    });

    this.nuevoComentario = '';
  }
}