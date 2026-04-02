import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCategories } from './liste-categories';

describe('ListeCategories', () => {
  let component: ListeCategories;
  let fixture: ComponentFixture<ListeCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCategories]
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
