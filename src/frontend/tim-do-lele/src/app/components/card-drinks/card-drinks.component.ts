import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/service/cart.service';
import { GetFoodService } from 'app/service/get-food.service';
import { Food } from 'app/components/Food.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-drinks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-drinks.component.html',
  styleUrls: ['./card-drinks.component.scss'],
})
export class CardDrinksComponent implements OnInit {
  bebidas: Food[] = [];

  constructor(
    private cartService: CartService,
    private getFoodService: GetFoodService // ✨ Adicionado aqui
  ) {}

  ngOnInit(): void {
    this.getFoodService.getDataDrinks().subscribe(data => {
      this.bebidas = data;
    });
  }

  addToCart(bebida: Food): void {
    this.cartService.addToCart({
      ...bebida,
      QUANTITY: 1,
    });
  }
}
