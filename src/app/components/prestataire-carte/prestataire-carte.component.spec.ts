import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestataireCarteComponent } from './prestataire-carte.component';

describe('PrestataireCarteComponent', () => {
  let component: PrestataireCarteComponent;
  let fixture: ComponentFixture<PrestataireCarteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestataireCarteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestataireCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
