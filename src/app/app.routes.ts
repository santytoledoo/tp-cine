import { Routes } from '@angular/router';
import { RegistroComponent } from './auth/registro/registro';
import { LoginComponent } from './auth/login/login';
import { PeliculasComponent } from './admin/peliculas/peliculas';
import { FuncionesComponent } from './admin/funciones/funciones';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { HomeComponent } from './cliente/home/home';
import { ButacasComponent } from './cliente/butacas/butacas';
import { CandybarComponent } from './cliente/candybar/candybar';
import { TicketComponent } from './cliente/ticket/ticket';
import { MisPeliculasComponent } from './cliente/mis-peliculas/mis-peliculas';
import { EscanerComponent } from './empleado/escaner/escaner';

export const routes: Routes = [
  // Rutas de autenticación
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },

  // Rutas de administración (Acá está la que necesitás)
  { path: 'admin/peliculas', component: PeliculasComponent },
  { path: 'admin/funciones', component: FuncionesComponent },
  { path: 'admin/dashboard', component: DashboardComponent },

  // Rutas de clientes
  { path: 'home', component: HomeComponent },
  { path: 'butacas', component: ButacasComponent },
  { path: 'candybar', component: CandybarComponent },
  { path: 'mis-peliculas', component: MisPeliculasComponent },
  { path: 'ticket', component: TicketComponent },
  { path: 'escaner', component: EscanerComponent },

  // Redirecciones por defecto
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];