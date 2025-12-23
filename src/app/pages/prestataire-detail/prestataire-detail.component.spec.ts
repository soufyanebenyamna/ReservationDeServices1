import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestataireDetailComponent } from './prestataire-detail.component';

describe('PrestataireDetailComponent', () => {
  let component: PrestataireDetailComponent;
  let fixture: ComponentFixture<PrestataireDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestataireDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestataireDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
