import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './ticket.html',
  styleUrls: ['./ticket.scss']
})
export class TicketComponent implements OnInit {
  isBrowser: boolean;
  miTextoParaElQr: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Aquí puedes asignar los datos reales de tu reserva o ticket
    this.miTextoParaElQr = "Reserva-Cine-TP-2026";
  }
}