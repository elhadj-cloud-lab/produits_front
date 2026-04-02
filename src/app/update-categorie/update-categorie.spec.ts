import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCategorie } from './update-categorie';

describe('UpdateCategorie', () => {
  let component: UpdateCategorie;
  let fixture: ComponentFixture<UpdateCategorie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCategorie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCategorie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
