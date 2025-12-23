import { provideRouter, RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { AjouterServiceComponent } from './pages/ajouter-service/ajouter-service.component';

import { NgModule } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// NOTE (FR): Définition des routes de l'application. Chaque route
// correspond à une page/standalone component du projet.
import { PrestataireDetailComponent } from './pages/prestataire-detail/prestataire-detail.component';
import { MesReservationsComponent } from './pages/mes-reservations-component/mes-reservations-component.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: AccueilComponent },
      { path: 'services', component: ServicesPageComponent },
      { path: 'ajouter-prestataire', component: AjouterServiceComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'prestataire/:id', component: PrestataireDetailComponent },
      { path: 'mes-reservations', component: MesReservationsComponent },
    ];


