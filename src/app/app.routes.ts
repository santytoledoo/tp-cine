import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'peliculas', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./auth/registro/registro').then(m => m.RegistroComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.DashboardComponent) 
  },
  { 
    path: 'butacas', 
    loadComponent: () => import('./cliente/butacas/butacas').then(m => m.ButacasComponent) 
  },
  { 
    path: 'candybar', 
    loadComponent: () => import('./cliente/candybar/candybar').then(m => m.CandybarComponent) 
  },
  { 
    path: 'perfil', 
    loadComponent: () => import('./cliente/perfil/perfil').then(m => m.PerfilComponent) 
  },
  { 
    path: 'ticket', 
    loadComponent: () => import('./cliente/ticket/ticket').then(m => m.TicketComponent) 
  },
  { 
    path: 'escaner', 
    loadComponent: () => import('./empleado/escaner/escaner').then(m => m.EscanerComponent) 
  },
  { 
    path: 'peliculas', 
    loadComponent: () => import('./cliente/home/home').then(m => m.HomeComponent) 
  },
  { path: '**', redirectTo: 'peliculas' }
];