import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService, Reservation } from '../../services/storage.service';

@Component({
  selector: 'app-mes-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mes-reservations-component.component.html',
  styleUrls: ['./mes-reservations-component.component.css']
})
export class MesReservationsComponent implements OnInit {

  reservations: Reservation[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservations = this.storageService.getReservations();
  }

  cancelReservation(id: number): void {
    const ok = this.storageService.cancelReservation(id);

    if (ok) {
      this.reservations = this.storageService.getReservations();
    } else {
      alert("Erreur lors de l'annulation.");
    }
  }
}
