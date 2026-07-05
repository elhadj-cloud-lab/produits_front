import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

import { AddProduit } from './add-produit';

const mockToastr = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

describe('AddProduit', () => {
  let component: AddProduit;
  let fixture: ComponentFixture<AddProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProduit],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
