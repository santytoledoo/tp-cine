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
  //  Rutas de Autenticación
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },

  //  Rutas de Administración y Empleados 
  { path: 'admin/peliculas', component: PeliculasComponent },
  { path: 'admin/funciones', component: FuncionesComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'escaner', component: EscanerComponent },

  //  Rutas de Clientes
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

  //  Ruta Comodín
  { path: '**', redirectTo: 'home' }
];