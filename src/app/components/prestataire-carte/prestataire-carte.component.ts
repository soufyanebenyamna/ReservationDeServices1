// src/app/components/prestataire-carte/prestataire-carte.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';

// NOTE (FR): Composant réutilisable affichant une carte de prestataire.
// - `@Input() prestataire` : données du prestataire à afficher
// - `@Output() voirDetails` : événement déclenché pour demander la navigation
//   vers la page de détails (envoie l'ID du prestataire)

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  selector: 'app-prestataire-carte',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prestataire-carte.component.html',
  styleUrls: ['./prestataire-carte.component.css']
})
export class PrestataireCarteComponent {
  @Input() prestataire!: Prestataire;
  @Output() voirDetails = new EventEmitter<number>();
  defaultImg = 'assets/images/Default-No-image.jpg';

  // NOTE (FR): Émet l'ID du prestataire quand l'utilisateur clique sur "Détails".
  onVoirDetails(): void {
    this.voirDetails.emit(this.prestataire.id);
  }

  // NOTE (FR): Remplace l'image par défaut si le chargement échoue.
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src && !img.src.includes(this.defaultImg)) {
      img.src = this.defaultImg;
    }
  }
}