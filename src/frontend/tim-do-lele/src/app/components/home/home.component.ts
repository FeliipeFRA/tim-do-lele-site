import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardFoodComponent } from '../card-food/card-food.component';
import { CardDrinksComponent } from '../card-drinks/card-drinks.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardFoodComponent, CardDrinksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    if (window.innerWidth <= 768) { // Verifica se a tela é mobile
      this.renderer.setStyle(document.body, 'background-image', 'url("assets/img/bg-mobile.png")');
      this.renderer.setStyle(document.body, 'background-size', 'cover');
      this.renderer.setStyle(document.body, 'background-position', 'center top');
    }
  }
}
