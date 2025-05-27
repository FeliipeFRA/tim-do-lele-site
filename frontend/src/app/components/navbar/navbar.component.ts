import { Component, ElementRef, ViewChild, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'app/service/cart.service';
import { Food } from 'app/models/Food.model';
import { RouterLink, Router } from '@angular/router';




@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Adiciona o schema para permitir elementos personalizados
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchForm') searchForm!: ElementRef;
  @ViewChild('cart') cart!: ElementRef;

  cartItems: Food[] = [];
  totalItems: number = 0;
  userName: string | null = '';
  role: string | null = '';
  isCartOpen: boolean = false;

  tiposMenu = [
    { id: 'inicio', nome: 'Início' },
    { id: 'cachorro-quente', nome: 'Cachorro-quente' },
    { id: 'hamburguer', nome: 'Hambúrguer' },
    { id: 'frango', nome: 'Frango' },
    { id: 'sanduiche', nome: 'Sanduíches' },
    { id: 'bebidas', nome: 'Bebidas' },
  ];

  activeTabIndex = 0;
  isMobile = false;

  checkIsMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor(public cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.checkIsMobile();
    window.addEventListener('resize', () => this.checkIsMobile());


    // Verifique se estamos no ambiente de navegador antes de acessar o localStorage
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userId');
      this.role = localStorage.getItem('role');
    }

    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateTotalItems();
    });
  }

  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  toggleSearchForm() {
    this.searchForm.nativeElement.classList.toggle('active');
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      this.cart.nativeElement.classList.add('active');
    } else {
      this.cart.nativeElement.classList.remove('active');
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideCart = this.cart?.nativeElement.contains(event.target);
    const clickedCartIcon = (event.target as HTMLElement).id === 'cart-btn';

    if (!clickedInsideCart && !clickedCartIcon) {
      this.isCartOpen = false;
      this.cart.nativeElement.classList.remove('active');
    }
  }

  toggleMenu() {
    const nav = document.querySelector('.nav');
    nav?.classList.toggle('active');
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

  get total(): number {
    return this.cartItems.reduce((total, item) => {
      const precoBase = item.PRECO * (item.QUANTITY ?? 1);
      const precoAdd = (item.additionals || []).reduce((soma, add) => soma + add.PRECO * (item.QUANTITY ?? 1), 0);
      return total + precoBase + precoAdd;
    }, 0);
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


  private updateTotalItems(): void {
    this.totalItems = this.cartItems.reduce(
      (sum, item) => sum + (item.QUANTITY || 1),
      0
    );
  }

  logout(): void {
    // Limpa os dados de login armazenados no localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    // Redireciona o usuário para a página de login
    this.router.navigate(['/login']);  // Navega para a página de login
  }
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120; // altura do header (ajuste se necessário)
      const pos = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: pos,
        behavior: 'smooth'
      });
    }


  }

}
