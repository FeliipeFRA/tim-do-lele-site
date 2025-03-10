import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object // Identifica se está no navegador ou no servidor
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) { // Garante que só execute no navegador
      if (window.innerWidth <= 768) { // Verifica se a tela é mobile
        
      }
    }
  }
}
