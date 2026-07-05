import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

import { Produits } from './produits';

const mockToastr = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

describe('Produits', () => {
  let component: Produits;
  let fixture: ComponentFixture<Produits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Produits],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Produits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
