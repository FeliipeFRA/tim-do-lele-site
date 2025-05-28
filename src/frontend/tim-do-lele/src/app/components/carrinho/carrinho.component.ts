import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'app/service/cart.service';
import { Food } from 'app/models/Food.model';
import { NavbarCheckoutComponent } from '../navbar-checkout/navbar-checkout.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarCheckoutComponent],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss'],
})
export class CarrinhoComponent implements OnInit {
  cartItems: Food[] = [];
  totalItems: number = 0;
  userName: string | null = '';
  role: string | null = '';
  private _total: number = 0; // Variável privada para armazenar o total
  horarioReserva: string = '';
  isEnviandoPedido: boolean = false;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userId');
      this.role = localStorage.getItem('role');
    }

    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateTotal(); // Atualiza o total sempre que os itens do carrinho mudam
    });
  }

  // Getter para a propriedade total
  get total(): number {
    return this._total;
  }

  handleImgError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../assets/img/lanche-p.png'; // Caminho para a imagem padrão
  }

  // Função para associar a imagem ao tipo
  getImagemPorTipo(tipo: string): string {
    switch (tipo) {
     case 'Lata':
        return 'assets/img/bebidas/lata.png';  // Caminho para imagem de lata
      case 'CACHORRO-QUENTE':
        return 'assets/img/lanches/cachorro-quente.png';  // Caminho para imagem de cachorro-quente
      case 'HAMBURGUER':
        return 'assets/img/lanches/hamburguer.png';  // Caminho para imagem de hambúrguer
      case 'FRANGO':
        return 'assets/img/lanches/frango.png';  // Caminho para imagem de frango
      case 'SANDUICHE':
        return 'assets/img/lanches/sanduiche.png';  // Caminho para imagem de frango
      default:
        return 'assets/img/lanches/default.png';  // Imagem padrão, caso o tipo não seja encontrado
    }
  }

  onImageError(event: any, tipo: string) {
    event.target.src = this.getImagemPorTipo(tipo);
  }

  getImagemPorIdOuTipo(id: number, tipo: string): string {
    let caminhoBase: string;
    if (tipo === 'Lata') {
      caminhoBase = 'assets/img/bebidas/';
    } else {
      caminhoBase = 'assets/img/lanches/';
    }

    const extensao = tipo === 'Lata' ? 'png' : 'jpg';
    const caminhoImagemPorId = `${caminhoBase}${id}.${extensao}`;

    // A imagem padrão baseada no tipo
    const imagemPadraoPorTipo = this.getImagemPorTipo(tipo);

    // Retorna o caminho por ID. O Angular não consegue verificar se o arquivo existe diretamente.
    // Então a gente assume que se o ID existe no sistema, a imagem foi colocada certinho.
    // (Se quiser tratar erro de imagem quebrada, dá para tratar no HTML depois)
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

  // Função para montar o objeto de pedido conforme o backend espera
  montarPedidoParaEnvio(): any {
    let itens: any[] = [];
    this.cartItems.forEach((item, idx) => {
      // Item principal (lanche/bebida)
      const parentKey = `${item.TIPO}_${item.ID}_${idx}`;
      itens.push({
        tipo: item.TIPO,
        itemId: item.ID,
        quantidade: item.QUANTITY || 1,
        parentItemId: null
      });
      // Molhos
      if (item.sauces && item.sauces.length > 0) {
        item.sauces.forEach((molho) => {
          itens.push({
            tipo: 'Molho',
            itemId: this.getIdMolhoByName(molho),
            quantidade: 1,
            parentItemId: item.ID // Associa ao item pai
          });
        });
      }
      // Adicionais
      if (item.additionals && item.additionals.length > 0) {
        item.additionals.forEach((add) => {
          itens.push({
            tipo: 'Adicional',
            itemId: add.ID,
            quantidade: 1,
            parentItemId: item.ID // Associa ao item pai
          });
        });
      }
    });
    return {
      userId: this.userName,
      horarioReserva: this.horarioReserva,
      itens
    };
  }

  // Função auxiliar para obter o ID do molho pelo nome (ajuste conforme seu sistema)
  getIdMolhoByName(nome: string): number {
    // Exemplo fixo, ajuste para buscar do backend se necessário
    const molhos = [
      { id: 1, nome: 'Ketchup' },
      { id: 2, nome: 'Mostarda' },
      { id: 3, nome: 'Barbecue' },
      { id: 4, nome: 'Maionese' },
      { id: 5, nome: 'Pimenta' },
      { id: 6, nome: 'Big Mac' }
    ];
    const found = molhos.find(m => m.nome === nome);
    return found ? found.id : 0;
  }

  async pagamentoNoLocal() {
    if (!this.horarioReserva) {
      alert('Informe o horário de reserva antes de finalizar o pedido!');
      return;
    }
    this.isEnviandoPedido = true;
    const pedido = this.montarPedidoParaEnvio();
    try {
      const resp: any = await this.http.post('http://localhost:8000/pedidos', pedido).toPromise();
      alert('Pedido realizado com sucesso!');
      this.cartService.clearCart(); // Limpa carrinho corretamente
      this.horarioReserva = '';
    } catch (err: any) {
      alert('Erro ao enviar pedido: ' + (err?.error?.message || 'Erro desconhecido.'));
    } finally {
      this.isEnviandoPedido = false;
    }
  }
}
