import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuponService {
  private porcentajePrimeraCompra: number = 20; 

  constructor() {}

  setPorcentajePrimeraCompra(porcentaje: number) {
    this.porcentajePrimeraCompra = porcentaje;
  }

  getPorcentajePrimeraCompra(): number {
    return this.porcentajePrimeraCompra;
  }

  validarCupon(codigo: string, usuario: { esPrimeraCompra: boolean, edad: number }): { valido: boolean, descuento: number, mensaje: string } {
    if (!codigo) {
      return { valido: false, descuento: 0, mensaje: 'Ingresá un código de cupón.' };
    }

    const codigoLimpio = codigo.trim().toUpperCase();

    if (codigoLimpio === 'PRIMERACOMPRA' || codigoLimpio === 'BIENVENIDA') {
      if (usuario.esPrimeraCompra) {
        return { 
          valido: true, 
          descuento: this.porcentajePrimeraCompra, 
          mensaje: `¡Cupón aplicado con éxito! ${this.porcentajePrimeraCompra}% OFF en tu primera compra.` 
        };
      } else {
        return { 
          valido: false, 
          descuento: 0, 
          mensaje: 'Este cupón es exclusivo para nuevos usuarios en su primera compra.' 
        };
      }
    }

    if (codigoLimpio === 'MAYORES50') {
      if (usuario.edad >= 50) {
        return { 
          valido: true, 
          descuento: 30, 
          mensaje: '¡Cupón de 30% OFF aplicado para mayores de 50 años!' 
        };
      } else {
        return { 
          valido: false, 
          descuento: 0, 
          mensaje: 'Error: Este cupón es exclusivo para usuarios mayores de 50 años.' 
        };
      }
    }

    return { valido: false, descuento: 0, mensaje: 'El código de cupón ingresado no es válido.' };
  }

  validarRestriccionEdad(peliculaRestriccion: string, edadUsuario: number): { permitido: boolean, mensaje: string } {
    if (peliculaRestriccion === '+18' && edadUsuario < 18) {
      return { 
        permitido: false, 
        mensaje: 'Acceso denegado: Esta película tiene restricción exclusiva para mayores de 18 años.' 
      };
    }
    
    if (peliculaRestriccion === '+13' && edadUsuario < 13) {
      return { 
        permitido: true, 
        mensaje: 'Aviso importante: Esta película requiere que el menor esté acompañado por un adulto responsable.' 
      };
    }

    return { permitido: true, mensaje: 'Acceso permitido.' };
  }
}