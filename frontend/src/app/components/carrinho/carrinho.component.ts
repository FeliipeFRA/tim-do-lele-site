import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from 'app/service/cart.service';
import { Food } from 'app/models/Food.model';
import { RouterLink, Router } from '@angular/router';
import { NavbarCheckoutComponent } from '../navbar-checkout/navbar-checkout.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
declare var timepicker: any;

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarCheckoutComponent, NgxMaterialTimepickerModule, HttpClientModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss'],
})
export class CarrinhoComponent implements OnInit, AfterViewInit {
  cartItems: Food[] = [];
  totalItems: number = 0;
  userName: string | null = '';
  role: string | null = '';
  private _total: number = 0; // Variável privada para armazenar o total
  timepicker: any;

  timeSlots: string[] = [];
  horarioSelecionado: string = '';
  isLoading = false;
  pedidoFinalizado = false;
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(private cartService: CartService, private http: HttpClient, private router: Router) {}

  
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

  
  ngAfterViewInit() {
  timepicker('#horario', {
    start: '19:30',
    end: '22:00',
    interval: 30,
    theme: 'dark'
  });
}

onHorarioChange(event: any) {
  const value = event.target.value;
  // Aceita apenas formato HH:MM (24h)
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (regex.test(value)) {
    this.horarioSelecionado = value;
    this.mensagemErro = '';
  } else {
    this.horarioSelecionado = '';
    this.mensagemErro = 'Horário inválido. Use o formato HH:MM.';
  }
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

  async finalizarPedido() {
    this.isLoading = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.mensagemErro = 'Usuário não autenticado.';
        this.isLoading = false;
        return;
      }
      if (!this.horarioSelecionado) {
        this.mensagemErro = 'Selecione um horário de retirada válido (HH:MM).';
        this.isLoading = false;
        return;
      }
      const response: any = await this.http.post('http://localhost:8000/finalizar-pedido', {
        userId: Number(userId),
        itens: this.cartItems.map(item => ({
          ...item,
          observacoes: item.observations || null,
          additionals: item.additionals || []
        })),
        horarioReserva: this.horarioSelecionado
      }).toPromise();
      this.mensagemSucesso = 'Pedido finalizado com sucesso! Total: R$ ' + (response.totalPedido || 0).toFixed(2).replace('.', ',');
      this.pedidoFinalizado = true;
      this.cartService.clearCart();
      // Removido o redirecionamento para o perfil
    } catch (error: any) {
      this.mensagemErro = error?.error?.message || 'Erro ao finalizar pedido.';
    } finally {
      this.isLoading = false;
    }
  }
}
