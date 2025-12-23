import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesReservationsComponentComponent } from './mes-reservations-component.component';

describe('MesReservationsComponentComponent', () => {
  let component: MesReservationsComponentComponent;
  let fixture: ComponentFixture<MesReservationsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesReservationsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesReservationsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
