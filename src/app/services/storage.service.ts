import { Injectable } from '@angular/core';

export interface Slot {
  id: number;
  date: string;
  time: string;
  reserved: boolean;
}

export interface Provider {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  description?: string;
  horaires?: string;
  img?: string;
  experience?: string;
  slots: Slot[];
  ratings?: number[];
}

export interface Reservation {
  id: number;
  providerId: number;
  providerName: string;
  date: string;
  start: string;
  end: string;
  status: string; // confirmed | cancelled
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // -------------------------
  // NOTE (FR): Service de stockage local
  // Ce service gère l'initialisation, la lecture/écriture
  // des prestataires et réservations depuis le localStorage.
  // Il fournit également des utilitaires (réservation, notes, etc.).
  // -------------------------
  /**
   * Add a numeric rating (1-5) to a provider and update its average rating.
   * Returns the new average or null if provider not found.
   * NOTE (FR): Ajoute une note numérique (1-5) à un prestataire et met à jour
   * la moyenne. Retourne la nouvelle moyenne ou `null` si le prestataire est introuvable.
   */
  addRating(id: number, ratingValue: number): number | null {
    const providers = this.getAllProviders();
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) return null;

    const provider = providers[index];
    if (!provider.ratings) provider.ratings = [];
    provider.ratings.push(ratingValue);

    // recalculate average rating
    const sum = provider.ratings.reduce((a, b) => a + b, 0);
    provider.rating = Math.round((sum / provider.ratings.length) * 10) / 10;

    providers[index] = provider;
    this.saveProviders(providers);

    return provider.rating;
  }

  /**
   * Reserve slots for a provider on a given date between startTime (inclusive)
   * and endTime (exclusive). Example times: "09:00", "12:00".
   * Returns true if any slot was reserved, false otherwise.
   * NOTE (FR): Réserve des créneaux pour un prestataire sur une date donnée
   * entre `startTime` (inclus) et `endTime` (exclus). Retourne `true` si au
   * moins un créneau a été réservé, `false` sinon.
   */
  reserveSlots(id: number, date: string, startTime: string, endTime: string): boolean {
    const providers = this.getAllProviders();
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) return false;

    const provider = providers[index];
    if (!provider.slots || provider.slots.length === 0) return false;

    const startHour = parseInt(String(startTime).split(':')[0]);
    const endHour = parseInt(String(endTime).split(':')[0]);
    let changed = false;

    for (let h = startHour; h < endHour; h++) {
      const timeStr = `${String(h).padStart(2, '0')}:00`;
      const slot = provider.slots.find(s => s.date === date && s.time === timeStr);
      if (slot && !slot.reserved) {
        slot.reserved = true;
        changed = true;
      }
    }

    if (changed) {
      providers[index] = provider;
      this.saveProviders(providers);
    }

    return changed;
  }

  private readonly PROVIDERS_KEY = 'reserveasy_providers';
  private readonly RESERVATIONS_KEY = 'reserveasy_reservations';

  constructor() {
    this.initializeStorage();
  }

  // -------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------
  private initializeStorage(): void {
    const providers = this.getAllProviders();
    if (providers.length === 0) {
      this.saveProviders(this.getDefaultProviders());
    }

    const reservations = this.getReservations();
    if (reservations.length === 0) {
      this.saveReservations([]);
    }
  }

  // -------------------------------------------------------
  // DEFAULT PROVIDERS
  // -------------------------------------------------------
  private getDefaultProviders(): Provider[] {
    const providers: Provider[] = [
      { id: 1, name: 'Coiffure Élégance', specialty: 'Salon de coiffure', rating: 4.8, price: 250, description: 'Salon moderne proposant coupe, coloration et soins.', horaires: 'Lun-Ven 09:00 - 18:00', img: 'assets/images/1.jpg', experience: '10 ans', slots: [], ratings: [5,4,5] },
      { id: 2, name: 'Dr. Santé Plus', specialty: 'Médecin Généraliste', rating: 4.5, price: 400, description: 'Cabinet médical – consultations générales.', horaires: 'Lun-Sam 08:00 - 16:00', img: 'assets/images/2.jpg', experience: '5 ans', slots: [], ratings: [5,4,4,5] },
      { id: 3, name: 'Fitness Pro', specialty: 'Salle de Sport', rating: 4.9, price: 150, description: 'Salle de sport équipée avec coachs certifiés.', horaires: 'Lun-Dim 06:00 - 22:00', img: 'assets/images/3.jpg', experience: 'Coachs certifiés', slots: [], ratings: [5,5,5,4] },
      { id: 4, name: 'Auto-Service Rapide', specialty: 'Mécanique', rating: 4.3, price: 300, description: 'Entretien et réparation rapide pour véhicules.', horaires: 'Lun-Ven 08:00 - 18:00', img: 'assets/images/4.jpg', experience: '15 ans', slots: [], ratings: [4,4,5] },
      { id: 5, name: 'Beauté & Spa', specialty: 'Esthétique', rating: 4.7, price: 320, description: 'Soins du visage et massages relaxants.', horaires: 'Lun-Sam 09:00 - 19:00', img: 'assets/images/5.jpg', experience: '8 ans', slots: [], ratings: [5,4,5,5] },
      { id: 6, name: 'Plomberie Express', specialty: 'Plomberie', rating: 4.1, price: 200, description: 'Interventions plomberie urgentes.', horaires: '24/7', img: 'assets/images/6.jpg', experience: '12 ans', slots: [], ratings: [4,4] },
      { id: 7, name: 'Cours de Piano', specialty: 'Musique', rating: 4.6, price: 180, description: 'Leçons de piano pour tous âges.', horaires: 'Après-midi et soir', img: 'assets/images/7.jpg', experience: '7 ans', slots: [], ratings: [5,4,5] },
      { id: 8, name: 'Jardinage Pro', specialty: 'Jardinage', rating: 4.2, price: 220, description: 'Entretien de jardins et espaces verts.', horaires: 'Lun-Sam 07:00 - 15:00', img: 'assets/images/8.jpg', experience: '9 ans', slots: [], ratings: [4,4,4] },
      { id: 9, name: 'Yoga Studio', specialty: 'Bien-être', rating: 4.8, price: 120, description: 'Cours collectifs et privés de yoga.', horaires: 'Matin et soir', img: 'assets/images/9.jpg', experience: '6 ans', slots: [], ratings: [5,5,4,5] },
      { id: 10, name: 'Informatique Plus', specialty: 'Informatique', rating: 4.4, price: 280, description: 'Assistance et dépannage informatique.', horaires: 'Lun-Ven 09:00 - 17:00', img: 'assets/images/10.jpg', experience: '10 ans', slots: [], ratings: [4,4,5] },
      { id: 11, name: 'Photographe Studio', specialty: 'Photographie', rating: 4.6, price: 500, description: 'Shooting portrait et événementiel.', horaires: 'Sur rendez-vous', img: 'assets/images/11.jpg', experience: '6 ans', slots: [], ratings: [5,4,5] },
      { id: 12, name: 'Coaching Carrière', specialty: 'Conseil', rating: 4.0, price: 350, description: 'Coaching professionnel et CV.', horaires: 'Sur rendez-vous', img: 'assets/images/12.jpg', experience: '11 ans', slots: [], ratings: [4,4] }
    ];

    providers.forEach(p => {
      p.slots = this.generateSlots();
    });

    return providers;
  }

  private generateSlots(): Slot[] {
    const slots: Slot[] = [];
    const hours = [9, 10, 11, 13, 14, 15, 16, 17];
    const daysToGenerate = 7;
    let slotId = 1;

    for (let d = 0; d < daysToGenerate; d++) {
      const date = this.getIsoDate(d);
      for (const h of hours) {
        const time = `${String(h).padStart(2, '0')}:00`;
        slots.push({ id: slotId++, date, time, reserved: false });
      }
    }

    return slots;
  }

  private getIsoDate(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  // -------------------------------------------------------
  // PROVIDERS STORAGE
  // -------------------------------------------------------
  getAllProviders(): Provider[] {
    return JSON.parse(localStorage.getItem(this.PROVIDERS_KEY) || '[]');
  }

  /**
   * NOTE (FR): Retourne les prestataires formatés pour l'affichage
   * (ajoute les valeurs par défaut pour l'image et l'expérience si manquantes).
   */
  getPrestatairesForDisplay(): { id: number; name: string; specialty: string; rating: number; experience: string; img: string; price: number }[] {
    return this.getAllProviders().map(p => ({
      id: p.id,
      name: p.name,
      specialty: p.specialty,
      rating: p.rating,
      experience: p.experience || 'Expérience non spécifiée',
      img: p.img || 'assets/images/img1.jpg',
      price: p.price
    }));
  }

  saveProviders(providers: Provider[]): void {
    localStorage.setItem(this.PROVIDERS_KEY, JSON.stringify(providers));
  }

  getProviderById(id: number): Provider | null {
    return this.getAllProviders().find(p => p.id === id) || null;
  }

  updateProvider(provider: Provider): void {
    const providers = this.getAllProviders();
    const index = providers.findIndex(p => p.id === provider.id);
    if (index !== -1) {
      providers[index] = provider;
      this.saveProviders(providers);
    }
  }

  /**
   * Add a new provider and generate default slots. Returns the created provider.
   * NOTE (FR): Ajoute un nouveau prestataire et génère des créneaux par défaut.
   * Retourne le prestataire créé.
   */
  addProvider(p: Omit<Provider, 'id' | 'slots' | 'rating' | 'ratings'>): Provider {
    const providers = this.getAllProviders();
    const maxId = providers.length > 0 ? Math.max(...providers.map(x => x.id)) : 0;
    const newProvider: Provider = {
      id: maxId + 1,
      name: p.name,
      specialty: p.specialty,
      description: p.description || 'Pas de description disponible.',
      price: p.price || 0,
      horaires: p.horaires || 'Sur rendez-vous',
      experience: p.experience || '',
      img: p.img || 'assets/images/img1.jpg',
      rating: 0,
      slots: this.generateSlots(),
      ratings: []
    };

    providers.push(newProvider);
    this.saveProviders(providers);
    return newProvider;
  }

  /**
   * Remove a provider by id. Returns true if removed.
   * NOTE (FR): Supprime un prestataire par identifiant. Retourne `true` si la
   * suppression a eu lieu.
   */
  removeProvider(id: number): boolean {
    const providers = this.getAllProviders();
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) return false;
    providers.splice(index, 1);
    this.saveProviders(providers);
    // Optionally remove related reservations
    const reservations = this.getReservations();
    const remaining = reservations.filter(r => r.providerId !== id);
    if (remaining.length !== reservations.length) {
      this.saveReservations(remaining);
    }
    return true;
  }

  // -------------------------------------------------------
  // RESERVATIONS STORAGE
  // -------------------------------------------------------
  // NOTE (FR): Récupère la liste des réservations stockées.
  getReservations(): Reservation[] {
    return JSON.parse(localStorage.getItem(this.RESERVATIONS_KEY) || '[]');
  }

  // NOTE (FR): Enregistre la liste des réservations dans le localStorage.
  saveReservations(res: Reservation[]): void {
    localStorage.setItem(this.RESERVATIONS_KEY, JSON.stringify(res));
  }

  // NOTE (FR): Ajoute une réservation et retourne l'objet créé (id généré).
  addReservation(r: Omit<Reservation, "id" | "status">): Reservation {
    const list = this.getReservations();
    const newReservation: Reservation = {
      ...r,
      id: Date.now(),
      status: "confirmée"
    };

    list.push(newReservation);
    this.saveReservations(list);

    return newReservation;
  }

  // NOTE (FR): Annule une réservation par son identifiant. Retourne `true`
  // si l'annulation a été effectuée.
  cancelReservation(id: number): boolean {
    const list = this.getReservations();
    const index = list.findIndex(r => r.id === id);

    if (index === -1) return false;

    list[index].status = "annulée";
    this.saveReservations(list);

    return true;
  }

  // NOTE (FR): Réinitialise le stockage (supprime les clés et réinitialise).
  clearStorage(): void {
    localStorage.removeItem(this.PROVIDERS_KEY);
    localStorage.removeItem(this.RESERVATIONS_KEY);
    this.initializeStorage();
  }
}
