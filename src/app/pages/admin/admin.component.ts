import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, Provider } from '../../services/storage.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  providers: Provider[] = [];

  editMode = false;
  current: Partial<Provider> = {};

  searchText = '';
  filterSpecialty = '';

  constructor(private storage: StorageService, private adminService: AdminService) {
    this.load();
  }

  resetStorage() {
    if (!confirm('Reset localStorage to defaults? This will delete all providers and reservations.')) return;
    this.storage.clearStorage();
    // ensure admin flag preserved as false
    this.adminService.setAdmin(false);
    this.load();
    alert('LocalStorage reset to defaults.');
  }

  load() {
    this.providers = this.storage.getAllProviders();
  }

  get specialties(): string[] {
    return Array.from(new Set(this.providers.map(p => p.specialty))).filter(Boolean).sort();
  }

  get filteredProviders(): Provider[] {
    const q = this.searchText.trim().toLowerCase();
    return this.providers.filter(p => {
      const matchesText = q === '' || (p.name && p.name.toLowerCase().includes(q));
      const matchesSpec = !this.filterSpecialty || p.specialty === this.filterSpecialty;
      return matchesText && matchesSpec;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.filterSpecialty = '';
  }

  startAdd() {
    this.editMode = true;
    this.current = { name: '', specialty: '', price: 0, description: '', horaires: '', experience: '', img: 'assets/images/img1.jpg' };
  }

  startEdit(p: Provider) {
    this.editMode = true;
    this.current = { ...p };
  }

  cancelEdit() {
    this.editMode = false;
    this.current = {};
  }

  onFileSelected(ev: any) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.current.img = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  save() {
    if (!this.current.name || !this.current.specialty) return;

    if (this.current.id) {
      // update
      this.storage.updateProvider(this.current as Provider);
    } else {
      // add
      const added = this.storage.addProvider({
        name: this.current.name!,
        specialty: this.current.specialty!,
        description: this.current.description,
        price: this.current.price as number,
        horaires: this.current.horaires,
        experience: this.current.experience,
        img: this.current.img
      });
      this.current = { ...added };
    }

    this.load();
    this.cancelEdit();
  }

  remove(id: number) {
    if (!confirm('Supprimer ce prestataire ?')) return;
    this.storage.removeProvider(id);
    this.load();
  }
}
