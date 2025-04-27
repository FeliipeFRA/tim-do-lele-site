import { Component, OnInit } from '@angular/core';
import { GetFoodService } from 'app/service/get-food.service';
import { CartService } from 'app/service/cart.service';
import { Food } from 'app/components/Food.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-card-food',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-food.component.html',
  styleUrls: ['./card-food.component.scss'],
})
export class CardFoodComponent implements OnInit {
  lanches: Food[] = [];
  lanchesAgrupados: { tipo: string; lanches: Food[]; imagem: string }[] = [];
  isPopupOpen = false;
  selectedLanche: Food | null = null;
  quantity: number = 1;  // Inicializa a quantidade com 1
  isSaucesVisible = true;
  isObservationsVisible = true;
  // Propriedade para controlar a exibição das opções de molhos
  isSauceOpen = false;

  sauces = [
    { name: 'Ketchup', selected: false },
    { name: 'Big Mac', selected: false },
    { name: 'Mostarda', selected: false },
    { name: 'Barbecue', selected: false },
    { name: 'Maionese', selected: false },
    { name: 'Pimenta', selected: false },
  ];

  constructor(private getFood: GetFoodService, private cartService: CartService) {}

  ngOnInit(): void {
    this.getFood.getDataFood().subscribe(data => {
      this.lanches = data;

      // Agrupar por tipo
      const agrupados: { [tipo: string]: Food[] } = {};
      for (const lanche of data) {
        if (!agrupados[lanche.TIPO]) {
          agrupados[lanche.TIPO] = [];
        }
        agrupados[lanche.TIPO].push(lanche);
      }

      // Ordem personalizada
      const ordem = ['CACHORRO-QUENTE', 'HAMBURGUER', 'FRANGO'];

      // Criar um array de lanches agrupados com a ordem correta
      this.lanchesAgrupados = ordem.map(tipo => ({
        tipo,
        lanches: agrupados[tipo] || [],
        imagem: this.getImagemPorTipo(tipo)  // Associar imagem ao tipo
      }));
    });
  }

  // Função para associar a imagem ao tipo
  getImagemPorTipo(tipo: string): string {
    switch (tipo) {
      case 'CACHORRO-QUENTE':
        return 'assets/img/lanches/cachorro-quente.png';  // Caminho para imagem de cachorro-quente
      case 'HAMBURGUER':
        return 'assets/img/lanches/hamburguer.png';  // Caminho para imagem de hambúrguer
      case 'FRANGO':
        return 'assets/img/lanches/frango.png';  // Caminho para imagem de frango
      default:
        return 'assets/img/lanches/default.png';  // Imagem padrão, caso o tipo não seja encontrado
    }
  
  }

  getImagemPorIdOuTipo(id: number, tipo: string): string {
    const caminhoBase = 'assets/img/lanches/';
    const caminhoImagemPorId = `${caminhoBase}${id}.jpg`;
  
    // A imagem padrão baseada no tipo
    const imagemPadraoPorTipo = this.getImagemPorTipo(tipo);
    // Retorna o caminho por ID. O Angular não consegue verificar se o arquivo existe diretamente.
    // Então a gente assume que se o ID existe no sistema, a imagem foi colocada certinho.
    // (Se quiser tratar erro de imagem quebrada, dá para tratar no HTML depois)
    return caminhoImagemPorId || imagemPadraoPorTipo;
  }
  
  onImageError(event: any, tipo: string) {
    event.target.src = this.getImagemPorTipo(tipo);
  }
  
  
  // Verifica se todos os molhos estão selecionados
  get areAllSaucesSelected(): boolean {
    return this.sauces.every(sauce => sauce.selected);
  }



  toggleAllSauces(): void {
    const newState = !this.areAllSaucesSelected;
    this.sauces.forEach(sauce => (sauce.selected = newState));
  }

  toggleSauce(sauce: { name: string; selected: boolean }): void {
    sauce.selected = !sauce.selected;
  }

  toggleSaucesVisibility(): void {
    this.isSaucesVisible = !this.isSaucesVisible;
  }

  toggleObservationsVisibility(): void {
    this.isObservationsVisible = !this.isObservationsVisible;
  }

  openPopup(lanche: Food): void {

    this.selectedLanche = lanche || {
      ID: 0, 
      NOME: '', 
      PRECO: 14, 
      INGREDIENTES: '', 
      QUANTITY: 1, 
      sauces: [], 
      observations: '' 
    };
    this.isPopupOpen = true;
    // Resetar os molhos selecionados
    this.sauces.forEach(sauce => sauce.selected = false);
    this.isSaucesVisible = true;
    this.isObservationsVisible = true;
    // Resetar observações
    if (this.selectedLanche) {
      this.selectedLanche.observations = ''; // ou deixar vazio, se for string
    }
  }

  onBackdropClick(event: Event): void {
    this.closePopup();
  }
  

  closePopup(): void {
    this.isPopupOpen = false;

    if (this.selectedLanche) {
      this.selectedLanche.QUANTITY = 1;  // Resetando a quantidade para 1
    }

    this.selectedLanche = null; // Limpa o lanche selecionado
  }

  increaseQuantity(): void {
    if (this.selectedLanche) {
      this.selectedLanche.QUANTITY = (this.selectedLanche.QUANTITY || 1) + 1;
      
    }
  }
  
  decreaseQuantity(): void {
    if (this.selectedLanche && this.selectedLanche.QUANTITY && this.selectedLanche.QUANTITY > 1) {
      this.selectedLanche.QUANTITY--;
    }
  }

  addToCart(): void {
    if (this.selectedLanche) {
      const lancheComDetalhes = {
        ...this.selectedLanche,
        sauces: this.sauces.filter(sauce => sauce.selected).map(sauce => sauce.name),
        observations: (document.getElementById('observations') as HTMLTextAreaElement)?.value || '',
      };
  
      this.cartService.addToCart(lancheComDetalhes);
      this.closePopup();
    }
  }
}
