import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  peliculas: any[] = [];
  peliculasFiltradas: any[] = [];
  textoBusqueda: string = '';

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPeliculas();
  }

  async cargarPeliculas() {
    const { data, error } = await this.supabase.client
      .from('peliculas')
      .select('*');

    if (data) {
      // Les asignamos los pósters oficiales directamente para evitar errores
      this.peliculas = data.map((p: any) => {
        if (p.titulo.includes('Deadpool')) {
          p.imagen_url = 'https://image.tmdb.org/t/p/original/8cdWjvZQUrmU311RscMhkli041.jpg';
        } else if (p.titulo.includes('Intensa')) {
          p.imagen_url = 'https://image.tmdb.org/t/p/original/m1MibxWqT8R056jQpPjKzI1tT5U.jpg';
        } else if (p.titulo.includes('Dune')) {
          p.imagen_url = 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2TGbiU05v.jpg';
        }
        return p;
      });

      this.peliculasFiltradas = this.peliculas;
      this.cdr.detectChanges(); 
    }
  }

  filtrar() {
    this.peliculasFiltradas = this.peliculas.filter(p => {
      const termino = this.textoBusqueda.toLowerCase();
      const coincideTitulo = p.titulo.toLowerCase().includes(termino);
      const coincideGenero = p.generos.some((g: string) => g.toLowerCase().includes(termino));
      
      return coincideTitulo || coincideGenero;
    });
  }
}