import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService, Provider } from '../../services/storage.service';

// NOTE (FR): Page pour ajouter un nouveau prestataire (service).
// Fournit un formulaire, validation minimale et enregistre en localStorage.

@Component({
  selector: 'app-ajouter-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-service.component.html',
  styleUrls: ['./ajouter-service.component.css']
})
export class AjouterServiceComponent {

  // List of 20 specialties
  specialties = [
    'Salon de coiffure',
    'Médecin Généraliste',
    'Salle de Sport',
    'Mécanique',
    'Esthétique',
    'Plomberie',
    'Musique',
    'Jardinage',
    'Bien-être',
    'Informatique',
    'Photographie',
    'Conseil',
    'Dentiste',
    'Nettoyage',
    'Électricité',
    'Massothérapie',
    'Cours de Langue',
    'Design Graphique',
    'Coaching Sportif',
    'Développement Web'
  ];

  // Form model
  form = {
    name: '',
    specialty: '',
    description: '',
    price: 0,
    horaires: '',
    experience: '',
    img: 'assets/images/img1.jpg'
  };


  successMessage = '';
  errorMessage = '';


  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  /**
   * NOTE (FR): Gère la sélection d'image (upload local) et convertit en
   * data URL pour stockage dans `form.img`.
   */
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Store the file as base64 data URL
        this.form.img = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * NOTE (FR): Soumet le formulaire et ajoute le prestataire en localStorage.
   * Effectue des validations minimales côté client.
   */
  submitForm(): void {
    if (!this.form.name.trim()) {
      this.errorMessage = 'Le nom du prestataire est obligatoire.';
      return;
    }

    if (!this.form.specialty.trim()) {
      this.errorMessage = 'La spécialité est obligatoire.';
      return;
    }

    if (this.form.price <= 0) {
      this.errorMessage = 'Le prix doit être supérieur à 0.';
      return;
    }

    // Get all existing providers to find max ID
    const providers = this.storageService.getAllProviders();
    const maxId = providers.length > 0 ? Math.max(...providers.map(p => p.id)) : 0;

    // Image is taken from the uploaded file (if any) or default

    // Create new provider
    const newProvider: Provider = {
      id: maxId + 1,
      name: this.form.name.trim(),
      specialty: this.form.specialty.trim(),
      description: this.form.description.trim() || 'Pas de description disponible.',
      price: this.form.price,
      horaires: this.form.horaires.trim() || 'Sur rendez-vous',
      experience: this.form.experience.trim() || 'Expérience non spécifiée',
      img: this.form.img,
      rating: 0,
      slots: this.generateSlots(),
      ratings: []
    };

    // Add to storage
    const updatedProviders = [...providers, newProvider];
    this.storageService.saveProviders(updatedProviders);

    // Show success
    this.successMessage = `Prestataire "${newProvider.name}" ajouté avec succès!`;
    this.errorMessage = '';

    // Reset form
    this.resetForm();

    // Redirect to services page after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/services']);
    }, 2000);
  }

  /**
   * NOTE (FR): Génère des créneaux par défaut pour le nouveau prestataire
   * (7 jours, créneaux horaires définis).
   */
  private generateSlots() {
    const slots = [];
    const hours = [9, 10, 11, 13, 14, 15, 16, 17]; // exclude 12:00
    const daysToGenerate = 7;
    let slotId = Math.floor(Math.random() * 10000); // random start ID

    for (let d = 0; d < daysToGenerate; d++) {
      const date = this.getIsoDate(d);
      for (const h of hours) {
        const time = `${String(h).padStart(2, '0')}:00`;
        slots.push({
          id: slotId++,
          date,
          time,
          reserved: false
        });
      }
    }

    return slots;
  }

  private getIsoDate(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  /**
   * NOTE (FR): Réinitialise les champs du formulaire.
   */
  resetForm(): void {
    this.form = {
      name: '',
      specialty: '',
      description: '',
      price: 0,
      horaires: '',
      experience: '',
      img: 'assets/images/img1.jpg'
    };
  }

  /**
   * NOTE (FR): Annule l'ajout et retourne à la page des services.
   */
  cancel(): void {
    this.router.navigate(['/services']);
  }

  /**
   * Handle file selection: read file as data URL and store that in `form.img`.
   * This places the image data in localStorage via provider's `img` property.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // store data URL in form.img (will be saved in localStorage)
      this.form.img = result;
    };
    reader.readAsDataURL(file);
  }
}
