import { Component, ElementRef, ViewChild, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteStatusService } from 'app/service/site-status.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
  siteAberto: boolean | null = null;
  mensagemStatus: string = '';
  userName: string | null = '';
  role: string | null = '';
  activeTabIndex = 0;
  isMobile = false;

  checkIsMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor(private siteStatusService: SiteStatusService, private router: Router) {}

  ngOnInit(): void {
    this.carregarStatus();

    
  }

  logout(): void {
    // Limpa os dados de login armazenados no localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    // Redireciona o usuário para a página de login
    this.router.navigate(['/login']);  // Navega para a página de login
  }

  carregarStatus(): void {
    this.siteStatusService.consultarStatus().subscribe({
      next: (res) => {
        this.siteAberto = res.aberto;
      },
      error: () => {
        this.mensagemStatus = 'Erro ao carregar status.';
      }
    });
  }

  setStatusAberto(): void {
    this.siteStatusService.atualizarStatus(true).subscribe({
      next: () => {
        this.siteAberto = true;
        this.mensagemStatus = 'Status definido como Aberto.';
      },
      error: () => {
        this.mensagemStatus = 'Erro ao alterar status.';
      }
    });
  }

  setStatusFechado(): void {
    this.siteStatusService.atualizarStatus(false).subscribe({
      next: () => {
        this.siteAberto = false;
        this.mensagemStatus = 'Status definido como Fechado.';
      },
      error: () => {
        this.mensagemStatus = 'Erro ao alterar status.';
      }
    });
  }

  setStatusAutomatico(): void {
    this.siteStatusService.atualizarStatus(null).subscribe({
      next: () => {
        this.siteAberto = null;
        this.mensagemStatus = 'Status definido para Horário Padrão.';
      },
      error: () => {
        this.mensagemStatus = 'Erro ao alterar status.';
      }
    });
  }
}
