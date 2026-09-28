import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FidelizacionService {
  // Configuración de costos de recompensa configurables por el Admin (según PDF)
  private costoEntradaPuntos: number = 500;
  private costoCandyPuntos: number = 150;

  // Combos especiales configurables por el admin que deben aparecer destacados
  private combosEspeciales = [
    { 
      id: 1, 
      nombre: 'Combo Estelar (1 Entrada + 1 Pochoclo Mediano + 1 Bebida)', 
      precio: 9500, 
      puntosRequeridos: 900,
      descripcion: 'El combo favorito de los cinéfilos.'
    },
    { 
      id: 2, 
      nombre: 'Combo Familiar (2 Entradas + 1 Pochoclo Grande + 2 Bebidas)', 
      precio: 16000, 
      puntosRequeridos: 1500,
      descripcion: 'Ideal para disfrutar en familia con la mejor economía.'
    }
  ];

  constructor() {}

  // Obtener los combos especiales para mostrarlos destacados en la pantalla de compra
  getCombosEspeciales() {
    return this.combosEspeciales;
  }

  // Cada peso gastado otorga 1 punto (según requerimiento de los inversores)
  calcularPuntosGanados(montoGastado: number): number {
    return Math.floor(montoGastado * 1);
  }

  // Canjear puntos acumulados por entradas o candy bar
  canjearRecompensa(puntosActuales: number, tipoRecompensa: 'entrada' | 'candy'): { exitoso: boolean, puntosRestantes: number, mensaje: string } {
    const costo = tipoRecompensa === 'entrada' ? this.costoEntradaPuntos : this.costoCandyPuntos;

    if (puntosActuales >= costo) {
      const nuevosPuntos = puntosActuales - costo;
      return {
        exitoso: true,
        puntosRestantes: nuevosPuntos,
        mensaje: `¡Canje exitoso! Canjeaste tus puntos por una ${tipoRecompensa}. Te quedan ${nuevosPuntos} puntos.`
      };
    } else {
      return {
        exitoso: false,
        puntosRestantes: puntosActuales,
        mensaje: `Puntos insuficientes. Necesitás ${costo} puntos y tenés ${puntosActuales}.`
      };
    }
  }

  // Configuración de costos desde el panel de admin
  actualizarCostos(entrada: number, candy: number) {
    this.costoEntradaPuntos = entrada;
    this.costoCandyPuntos = candy;
  }
}