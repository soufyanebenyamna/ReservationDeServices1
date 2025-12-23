

import { Component, OnInit } from '@angular/core';

// NOTE (FR): Page d'accueil affichant les prestataires mis en avant (top 6).
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { PrestataireCarteComponent } from '../../components/prestataire-carte/prestataire-carte.component';
import { StorageService, Provider } from '../../services/storage.service';

interface Prestataire {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  img: string;
  price: number;
}

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PrestataireCarteComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  prestataires: Prestataire[] = [];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.loadPrestataires();
  }

  /**
   * NOTE (FR): Charge la liste des prestataires pour la page d'accueil.
   * Utilise `getPrestatairesForDisplay` du `StorageService` pour éviter
   * la duplication de logique de mapping des données.
   */
  loadPrestataires(): void {
    // récupérer tous les prestataires formatés
    const all = this.storageService.getPrestatairesForDisplay();

    // Afficher les 6 meilleurs par note
    this.prestataires = all.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  }

  /**
   * NOTE (FR): Navigue vers la page de détails d'un prestataire.
   */
  voirDetails(id: number): void {
    console.log(`[NAVIGATION] Demande de voir les détails du prestataire ID: ${id}`);
    this.router.navigate(['/prestataire', id]);
  }
}