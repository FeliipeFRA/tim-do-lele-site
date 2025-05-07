import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'app/service/cart.service';
import { Food } from 'app/models/Food.model';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss'],
})
export class CarrinhoComponent implements OnInit {
  cartItems: Food[] = [];
  private _total: number = 0; // Variável privada para armazenar o total

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateTotal(); // Atualiza o total sempre que os itens do carrinho mudam
    });
  }

  // Getter para a propriedade total
  get total(): number {
    return this._total;
  }

  // Função para associar a imagem ao tipo
  getImagemPorTipo(tipo: string): string {
    switch (tipo) {
      case 'CACHORRO-QUENTE':
        return 'assets/img/lanches/cachorro-quente.png';
      case 'HAMBURGUER':
        return 'assets/img/lanches/hamburguer.png';
      case 'FRANGO':
        return 'assets/img/lanches/frango.png';
      case 'SANDUICHE':
        return 'assets/img/lanches/sanduiche.png';
      default:
        return 'assets/img/lanches/default.png';
    }
  }

  onImageError(event: any, tipo: string) {
    event.target.src = this.getImagemPorTipo(tipo);
  }

  getImagemPorIdOuTipo(id: number, tipo: string): string {
    const caminhoBase = 'assets/img/lanches/';
    const caminhoImagemPorId = `${caminhoBase}${id}.jpg`;

    const imagemPadraoPorTipo = this.getImagemPorTipo(tipo);
    return caminhoImagemPorId || imagemPadraoPorTipo;
  }

  formatarPrecoTotalItem(item: Food): string {
    const quantidade = item.QUANTITY ?? 1;
    const precoBase = item.PRECO * quantidade;
    const precoAdd = (item.additionals || []).reduce(
      (soma, a) => soma + a.PRECO * quantidade,
      0
    );
    const total = precoBase + precoAdd;
    return total.toFixed(2).replace('.', ',');
  }

  // Atualiza o total ao somar os itens no carrinho
  updateTotal(): void {
    this._total = this.cartItems.reduce((sum, item) => {
      const precoBase = item.PRECO * (item.QUANTITY ?? 1);
      const precoAdd = (item.additionals || []).reduce(
        (soma, add) => soma + add.PRECO * (item.QUANTITY ?? 1),
        0
      );
      return sum + precoBase + precoAdd;
    }, 0);
  }
}
