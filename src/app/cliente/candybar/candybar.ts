import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FidelizacionService } from '../../core/services/fidelizacion';
import { CuponService } from '../../core/services/cupon';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-candybar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candybar.html',
  styleUrls: ['./candybar.scss']
})
export class CandybarComponent implements OnInit {
  isBrowser: boolean;
  productos = [
    { nombre: 'Pochoclo Grande', precio: 5000, img: '🍿' },
    { nombre: 'Gaseosa Grande', precio: 3000, img: '🥤' },
    { nombre: 'Nachos con Queso', precio: 4500, img: '🧀' }
  ];

  combosEspeciales: any[] = [];
  carrito: any[] = [];
  subtotal = 0;
  
  // Variables para la gestión de cupones
  codigoCupon: string = '';
  mensajeCupon: string = '';
  cuponAplicado: boolean = false;
  descuentoAplicadoPorcentaje: number = 0;
  montoDescuento: number = 0;
  totalFinal: number = 0;
  precioEntradas: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private fidelizacionService: FidelizacionService,
    private cuponService: CuponService,
    private supabase: SupabaseService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    this.combosEspeciales = this.fidelizacionService.getCombosEspeciales();
    
    if (this.isBrowser) {
      const ticketParcial = JSON.parse(localStorage.getItem('ticket_parcial') || '{}');
      this.precioEntradas = ticketParcial.precioEntradas || 6000;
      this.calcularTotales();
    }
  }

  agregarAlCarrito(prod: any) {
    this.carrito.push(prod);
    this.calcularTotales();
  }

  agregarCombo(combo: any) {
    this.carrito.push({
      nombre: combo.nombre,
      precio: combo.precio
    });
    this.calcularTotales();
  }

  calcularTotales() {
    const totalCandy = this.carrito.reduce((acc, item) => acc + item.precio, 0);
    this.subtotal = this.precioEntradas + totalCandy;

    if (this.cuponAplicado) {
      this.montoDescuento = (this.subtotal * this.descuentoAplicadoPorcentaje) / 100;
      this.totalFinal = this.subtotal - this.montoDescuento;
    } else {
      this.montoDescuento = 0;
      this.totalFinal = this.subtotal;
    }
  }

  async aplicarCupon() {
    if (!this.codigoCupon.trim()) {
      this.mensajeCupon = 'Por favor, ingresá un código de cupón.';
      return;
    }

    let esPrimeraCompra = true;
    let edadUsuario = 25;

    if (this.isBrowser) {
      try {
        const { data } = await this.supabase.client.auth.getSession();
        if (data.session?.user) {
          const userId = data.session.user.id;
          
          // Verificamos si ya tiene compras en su historial
          const historial = JSON.parse(localStorage.getItem(`historial_compras_${userId}`) || '[]');
          if (historial.length > 0) {
            esPrimeraCompra = false;
          }

          // Verificamos su edad mediante la fecha de nacimiento guardada
          const extraGuardado = localStorage.getItem(`perfil_extra_${userId}`);
          if (extraGuardado) {
            const extra = JSON.parse(extraGuardado);
            if (extra.fechaNacimiento) {
              const anioNac = new Date(extra.fechaNacimiento).getFullYear();
              edadUsuario = new Date().getFullYear() - anioNac;
            }
          }
        }
      } catch (e) {
        console.warn('No se pudo validar la sesión para el cupón.');
      }
    }

    // Validamos mediante el servicio de cupones actualizado
    const resultado = this.cuponService.validarCupon(this.codigoCupon, {
      esPrimeraCompra: esPrimeraCompra,
      edad: edadUsuario
    });

    if (resultado.valido) {
      this.cuponAplicado = true;
      this.descuentoAplicadoPorcentaje = resultado.descuento; // 20% o 40% según corresponda
      this.mensajeCupon = resultado.mensaje;
      this.calcularTotales();
    } else {
      this.cuponAplicado = false;
      this.descuentoAplicadoPorcentaje = 0;
      this.mensajeCupon = resultado.mensaje;
      this.calcularTotales();
    }
  }

  finalizarCompra() {
    if (this.isBrowser) {
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

      const ticketFinal = {
        pelicula: ticketParcial.pelicula || 'Película General',
        sala: ticketParcial.sala || 'Sala 1',
        butacas: ticketParcial.butacas || 'Sin asientos',
        candybar: descripcionCandy,
        montoPagado: this.totalFinal, // Total con descuento aplicado correctamente
        descuentoAplicado: this.montoDescuento
      };

      localStorage.setItem('ticket_final', JSON.stringify(ticketFinal));
    }

    this.router.navigate(['/ticket']);
  }
}