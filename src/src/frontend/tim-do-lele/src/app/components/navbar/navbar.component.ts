import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'app/service/cart.service';
import { Food } from 'app/components/Food.model';

import { PostPedidosService } from 'app/service/post-pedidos.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchForm') searchForm!: ElementRef;
  @ViewChild('cart') cart!: ElementRef;

  cartItems: Food[] = [];
  totalItems: number = 0;

  constructor(public cartService: CartService,
    private postPedidosService: PostPedidosService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateTotalItems();
    });
  }

  toggleSearchForm() {
    this.searchForm.nativeElement.classList.toggle('active');
  }

  toggleCart() {
    this.cart.nativeElement.classList.toggle('active');
  }

  toggleMenu() {
    const nav = document.querySelector('.nav');
    nav?.classList.toggle('active');
  }

  handleImgError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../assets/img/lanche-p.png'; // Caminho para a imagem padrão
  }
  

  get total(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.PRECO * (item.QUANTITY || 1),
      0
    );
  }

  private updateTotalItems(): void {
    this.totalItems = this.cartItems.reduce(
      (sum, item) => sum + (item.QUANTITY || 1),
      0
    );
  }

  submitCart(): void {
    const pedido = {
      items: this.cartItems.map(item => ({
        id: item.ID,
        quantity: item.QUANTITY,
        sauces: item.sauces || [],
        observations: item.observations || ''
      })),
      total: this.total,
      userId: 1 // Substitua pelo ID do usuário atual, se necessário.
    };
  
    this.postPedidosService.postDataPedidos(pedido).subscribe(
      response => {
        console.log('Pedido enviado com sucesso:', response);
        alert('Pedido enviado com sucesso!');
      },
      error => {
        console.error('Erro ao enviar pedido:', error);
        alert('Erro ao enviar pedido.');
      }
    );
  }

}
