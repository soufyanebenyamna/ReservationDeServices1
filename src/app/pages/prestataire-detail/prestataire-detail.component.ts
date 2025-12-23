import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StorageService, Provider, Slot } from '../../services/storage.service';

@Component({
  selector: 'app-prestataire-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './prestataire-detail.component.html',
  styleUrls: ['./prestataire-detail.component.css']
})
export class PrestataireDetailComponent implements OnInit {
  provider?: Provider;
  defaultImg = 'assets/images/Default-No-image.jpg';

  // selection flow
  selectedDate: string | null = null;
  selectedStartSlot: Slot | null = null;
  selectedEndSlot: Slot | null = null;

  // reservation form model
  reserverName = '';
  reserverPhone = '';
  reserverEmail = '';
  reservationSuccess = false;
  errorMessage = '';

  // rating form model
  ratingValue: number | null = null;
  ratingSuccess = false;

  constructor(private route: ActivatedRoute, private storageService: StorageService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id') ?? '';
    const id = Number(idParam);
    const p = this.storageService.getProviderById(id);
    if (p) {
      this.provider = p;
    }
  }

  chooseDate(date: string) {
    this.selectedDate = date;
    this.selectedStartSlot = null;
    this.selectedEndSlot = null;
    this.reservationSuccess = false;
    this.errorMessage = '';
  }

  chooseStartTime(slot: Slot) {
    if (slot.reserved) return;
    this.selectedStartSlot = slot;
    this.selectedEndSlot = null;
  }

  chooseEndTime(slot: Slot) {
    if (slot.reserved || !this.selectedStartSlot) return;
    const startHour = parseInt(this.selectedStartSlot.time.split(':')[0]);
    const endHour = parseInt(slot.time.split(':')[0]);
    if (endHour <= startHour) {
      this.errorMessage = "L'heure de fin doit être après l'heure de début.";
      return;
    }

    this.selectedEndSlot = slot;
    this.errorMessage = '';
  }

  get selectedHours(): number {
    if (!this.selectedStartSlot || !this.selectedEndSlot) return 0;
    const startHour = parseInt(this.selectedStartSlot.time.split(':')[0]);
    const endHour = parseInt(this.selectedEndSlot.time.split(':')[0]);
    return endHour - startHour;
  }

  get totalPrice(): number {
    if (!this.provider) return 0;
    return this.selectedHours * this.provider.price;
  }

  get availableDates(): string[] {
    if (!this.provider) return [];
    const dates = Array.from(new Set(this.provider.slots.map(s => s.date)));
    return dates;
  }

  slotsForDate(date: string): Slot[] {
    if (!this.provider) return [];
    return this.provider.slots.filter(s => s.date === date);
  }

  clearSelection() {
    this.selectedDate = null;
    this.selectedStartSlot = null;
    this.selectedEndSlot = null;
    this.reserverName = '';
    this.reserverPhone = '';
    this.reserverEmail = '';
    this.reservationSuccess = false;
    this.errorMessage = '';
  }

  submitReservation() {
    if (!this.selectedStartSlot || !this.selectedEndSlot) {
      this.errorMessage = "Veuillez sélectionner une plage horaire.";
      return;
    }
    if (!this.reserverName.trim() || !this.reserverPhone.trim() || !this.reserverEmail.trim()) {
      this.errorMessage = "Remplissez tous les champs du formulaire.";
      return;
    }

    if (!this.provider || !this.selectedDate) return;

    const reserved = this.storageService.reserveSlots(
      this.provider.id,
      this.selectedDate,
      this.selectedStartSlot.time,
      this.selectedEndSlot.time
    );

    if (!reserved) {
      this.errorMessage = 'Impossible de réserver : plage indisponible.';
      return;
    }

    // create reservation record
    this.storageService.addReservation({
      providerId: this.provider.id,
      providerName: this.provider.name,
      date: this.selectedDate,
      start: this.selectedStartSlot.time,
      end: this.selectedEndSlot.time
    });

    // reload provider to reflect reserved slots
    this.provider = this.storageService.getProviderById(this.provider.id) || undefined;

    this.reservationSuccess = true;
    this.errorMessage = '';
    // keep contact info if desired or clear
    setTimeout(() => this.reservationSuccess = false, 3000);
  }

  get averageRating(): number {
    if (!this.provider || !this.provider.ratings || this.provider.ratings.length === 0) return this.provider?.rating ?? 0;
    const sum = this.provider.ratings.reduce((a, b) => a + b, 0);
    return Math.round((sum / this.provider.ratings.length) * 10) / 10;
  }

  get ratingCount(): number {
    return this.provider && this.provider.ratings ? this.provider.ratings.length : 0;
  }

  getStarDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '☆';
    stars += '☆'.repeat(emptyStars);
    return stars;
  }

  submitRating() {
    if (!this.provider) return;
    if (!this.ratingValue || this.ratingValue < 1 || this.ratingValue > 5) {
      this.ratingSuccess = false;
      return;
    }

    const newAvg = this.storageService.addRating(this.provider.id, this.ratingValue);
    if (newAvg !== null) {
      // refresh provider
      this.provider = this.storageService.getProviderById(this.provider.id) || undefined;
      this.ratingSuccess = true;
      this.ratingValue = null;
      setTimeout(() => this.ratingSuccess = false, 2500);
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src && !img.src.includes(this.defaultImg)) {
      img.src = this.defaultImg;
    }
  }
}

