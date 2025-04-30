import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Food } from 'app/components/Food.model';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Food[] = [];
  private cartSubject = new BehaviorSubject<Food[]>([]);
  public cart$ = this.cartSubject.asObservable();

  

  addToCart(item: Food): void {
    // Verifica se o lanche já existe no carrinho com os mesmos molhos e observações
    const existingItem = this.cartItems.find(cartItem => 
      cartItem.ID === item.ID && 
      JSON.stringify(cartItem.sauces) === JSON.stringify(item.sauces) && 
      cartItem.observations === item.observations
    );
  
    if (existingItem) {
      // Se o item já existe, garante que QUANTITY seja definida
      existingItem.QUANTITY = (existingItem.QUANTITY || 1) + item.QUANTITY!; // Se não tiver QUANTITY, inicializa como 0 antes de somar
    } else {
      // Se o item não existir, adiciona com QUANTITY inicializada como 1
      this.cartItems.push({ ...item, QUANTITY: item.QUANTITY || 1 });
    }
  
    this.cartSubject.next(this.cartItems);
  }
  

  increaseQuantity(item: Food): void {
    const cartItem = this.cartItems.find(cartItem => cartItem.ID === item.ID);
    if (cartItem) {
      cartItem.QUANTITY = (cartItem.QUANTITY || 1) + 1;
      this.cartSubject.next(this.cartItems);
    }
  }

  decreaseQuantity(item: Food): void {
    const cartItem = this.cartItems.find(cartItem => cartItem.ID === item.ID);
    if (cartItem && cartItem.QUANTITY && cartItem.QUANTITY > 1) {
      cartItem.QUANTITY--;
      this.cartSubject.next(this.cartItems);
    }
  }

  getCartItems(): Food[] {
    return this.cartItems;
  }

  removeFromCart(item: Food): void {
    const index = this.cartItems.findIndex(cartItem => cartItem.ID === item.ID);
    if (index !== -1) {
      this.cartItems.splice(index, 1); // Remove o item
      this.cartSubject.next(this.cartItems); // Atualiza os observadores
    }
  }
}
