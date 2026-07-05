import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

import { ListeCategories } from './liste-categories';

const mockToastr = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

describe('ListeCategories', () => {
  let component: ListeCategories;
  let fixture: ComponentFixture<ListeCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCategories],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
