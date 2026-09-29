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
import { PerfilComponent } from './cliente/perfil/perfil';
import { EscanerComponent } from './empleado/escaner/escaner';
import { ClientLayoutComponent } from './cliente/client-layout/client-layout';

export const routes: Routes = [
  // 1. Rutas de Autenticación
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },

  // 2. Rutas de Administración y Empleados (independientes)
  { path: 'admin/peliculas', component: PeliculasComponent },
  { path: 'admin/funciones', component: FuncionesComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'escaner', component: EscanerComponent },

  // 3. Rutas de Clientes (agrupadas con la barra de navegación superior)
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'butacas', component: ButacasComponent },
      { path: 'candybar', component: CandybarComponent },
      { path: 'mis-peliculas', component: MisPeliculasComponent },
      { path: 'ticket', component: TicketComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // 4. Ruta Comodín (SIEMPRE debe ir al final de todo)
  { path: '**', redirectTo: 'home' }
];