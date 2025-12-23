import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PrestataireCarteComponent } from "../../components/prestataire-carte/prestataire-carte.component";
import { StorageService, Provider } from '../../services/storage.service';

// NOTE (FR): Page listant tous les services (prestataires) disponibles.
// Fournit des filtres, recherche et navigation vers les détails d'un prestataire.

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
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PrestataireCarteComponent],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css']
})
export class ServicesPageComponent implements OnInit {

  searchText: string = '';
  selectedSpecialty: string = 'all';
  minRating: number = 0;
  priceMin: number | null = null;
  priceMax: number | null = null;
  minExperienceYears: number | null = null;

  prestataires: Prestataire[] = [];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.loadPrestataires();
  }

  /**
   * NOTE (FR): Charge la liste des prestataires pour la page Services.
   * Utilise la méthode utilitaire du `StorageService` pour garder la logique
   * de mapping en un seul endroit et éviter la duplication.
   */
  loadPrestataires(): void {
    this.prestataires = this.storageService.getPrestatairesForDisplay();
  }

  /**
   * NOTE (FR): Extrait la liste unique des spécialités présentes.
   */
  get specialties(): string[] {
    const set = new Set(this.prestataires.map(p => p.specialty));
    return Array.from(set);
  }

  voirDetails(id: number): void {
    console.log(`[NAVIGATION] Demande de voir les détails du prestataire ID: ${id}`);
    this.router.navigate(['/prestataire', id]);
  }

  /**
   * Filtered list for UI
   */
  get filteredPrestataires(): Prestataire[] {
    const q = this.searchText.trim().toLowerCase();
    return this.prestataires.filter(p => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q);

      const matchesSpecialty =
        this.selectedSpecialty === 'all' ||
        p.specialty === this.selectedSpecialty;

      const matchesRating = !this.minRating || (p.rating >= this.minRating);

      const matchesPriceMin = (this.priceMin === null) || (p.price >= this.priceMin);
      const matchesPriceMax = (this.priceMax === null) || (p.price <= this.priceMax);

      const expYears = this.parseExperienceYears(p.experience);
      const matchesExperience = (this.minExperienceYears === null) || (expYears >= this.minExperienceYears);

      return matchesSearch && matchesSpecialty && matchesRating && matchesPriceMin && matchesPriceMax && matchesExperience;
    });
  }

  private parseExperienceYears(exp: string | undefined): number {
    if (!exp) return 0;
    const m = exp.match(/(\d+)/);
    if (!m) return 0;
    return Number(m[1]);
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSpecialty = 'all';
    this.minRating = 0;
    this.priceMin = null;
    this.priceMax = null;
    this.minExperienceYears = null;
  }
}
