import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Food } from 'app/models/Food.model';



@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Food[] = [];
  private cartSubject = new BehaviorSubject<Food[]>([]);
  public cart$ = this.cartSubject.asObservable();

  private getStorageKey(): string {
  const userId = localStorage.getItem('userId');
  return userId ? `cart_${userId}` : 'cart_guest';
  }
  reloadCart(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const storedCart = localStorage.getItem(this.getStorageKey());
      this.cartItems = storedCart ? JSON.parse(storedCart) : [];
      this.cartSubject.next(this.cartItems);
    }
  }

  constructor() {
    if (typeof window !== 'undefined' && localStorage) {
      const storedCart = localStorage.getItem(this.getStorageKey());
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.cartSubject.next(this.cartItems);
      }
    }
  }
 
  private updateLocalStorage() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.cartItems));
    }
  }
  
  

  addToCart(item: Food): void {
    const existingItem = this.cartItems.find(cartItem =>
      cartItem.ID === item.ID &&
      JSON.stringify(cartItem.sauces) === JSON.stringify(item.sauces) &&
      JSON.stringify(cartItem.additionals) === JSON.stringify(item.additionals) &&
      cartItem.observations === item.observations
    );
  
    if (existingItem) {
      existingItem.QUANTITY = (existingItem.QUANTITY || 1) + (item.QUANTITY || 1);
    } else {
      this.cartItems.push({ ...item, QUANTITY: item.QUANTITY || 1 });
    }
  
    this.cartSubject.next(this.cartItems);
    this.updateLocalStorage();
  }
  
  increaseQuantity(item: Food): void {
    const cartItem = this.cartItems.find(cartItem =>
      cartItem.TIPO === item.TIPO &&
      cartItem.ID === item.ID &&
      JSON.stringify(cartItem.sauces) === JSON.stringify(item.sauces) &&
      JSON.stringify(cartItem.additionals) === JSON.stringify(item.additionals) &&
      cartItem.observations === item.observations
    );
  
    if (cartItem) {
      cartItem.QUANTITY = (cartItem.QUANTITY || 1) + 1;
      this.cartSubject.next(this.cartItems);
    }
  }
  
  decreaseQuantity(item: Food): void {
    const cartItem = this.cartItems.find(cartItem =>
      cartItem.ID === item.ID &&
      JSON.stringify(cartItem.sauces) === JSON.stringify(item.sauces) &&
      JSON.stringify(cartItem.additionals) === JSON.stringify(item.additionals) &&
      cartItem.observations === item.observations
    );
  
    if (cartItem && cartItem.QUANTITY && cartItem.QUANTITY > 1) {
      cartItem.QUANTITY--;
      this.cartSubject.next(this.cartItems);
    }
  }
  

  getCartItems(): Food[] {
    return this.cartItems;
  }

  removeFromCart(item: Food): void {
    const index = this.cartItems.findIndex(cartItem =>
      cartItem.ID === item.ID &&
      JSON.stringify(cartItem.sauces) === JSON.stringify(item.sauces) &&
      JSON.stringify(cartItem.additionals) === JSON.stringify(item.additionals) &&
      cartItem.observations === item.observations
    );
  
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartSubject.next(this.cartItems);
       this.updateLocalStorage(); // Atualiza o localStorage com o carrinho modificado
    }
  }
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.getStorageKey());
    }
  }
}
