import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFoodComponent } from '../card-food/card-food.component';


@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, CardFoodComponent],
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent  {


}
