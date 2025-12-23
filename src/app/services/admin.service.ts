import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  // NOTE (FR): Service simple pour gérer l'état "admin" dans localStorage.
  // Permet d'activer/désactiver un mode administrateur et d'en notifier
  // les abonnés via un BehaviorSubject.

  private readonly KEY = 'reserveasy_admin';
  private subject = new BehaviorSubject<boolean>(this.getFromStorage());

  admin$ = this.subject.asObservable();

  private getFromStorage(): boolean {
    return localStorage.getItem(this.KEY) === 'true';
  }

  // NOTE (FR): Définit l'état admin et notifie les abonnés.
  setAdmin(value: boolean) {
    localStorage.setItem(this.KEY, value ? 'true' : 'false');
    this.subject.next(value);
  }

  // NOTE (FR): Basculer l'état admin (true/false).
  toggle() {
    this.setAdmin(!this.getFromStorage());
  }

  // NOTE (FR): Indique si l'utilisateur est admin (depuis le stockage).
  isAdmin(): boolean {
    return this.getFromStorage();
  }
}
