import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDrinksComponent } from './card-drinks.component';

describe('CardDrinksComponent', () => {
  let component: CardDrinksComponent;
  let fixture: ComponentFixture<CardDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDrinksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
