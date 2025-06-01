import { Component, ElementRef, ViewChild, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteStatusService } from 'app/service/site-status.service';
import { RouterLink, Router } from '@angular/router';
import { AdminCfgComponent } from '../admin-cfg/admin-cfg.component';

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
  isPopupOpen = false;
  modoSelecionado: 'aberto' | 'fechado' | 'automatico' = 'automatico';
statusAtual: boolean = false; // Aberto (true) ou Fechado (false) real


  checkIsMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor(private siteStatusService: SiteStatusService, private router: Router) {}

  ngOnInit(): void {
    this.carregarStatus();
    
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userId');
      this.role = localStorage.getItem('role');
    }

    
  }

  logout(): void {
    // Limpa os dados de login armazenados no localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    // Redireciona o usuário para a página de login
    this.router.navigate(['/admin']);  // Navega para a página de login
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

  setStatusAutomatico(): void {
  this.siteStatusService.atualizarStatus(null).subscribe({
    next: () => {
      this.mensagemStatus = 'Status definido para Horário Padrão.';
      this.siteAberto = null;

      this.verificarStatusAutomatico(); // ✅ Checar imediatamente se está aberto ou fechado
    },
    error: () => {
      this.mensagemStatus = 'Erro ao alterar status.';
    }
  });
}


verificarStatusAutomatico(): void {
  this.siteStatusService.consultarStatus().subscribe({
    next: (res) => {
      this.siteAberto = res.aberto; // Se dentro do horário, retorna true, senão false
    },
    error: () => {
      this.mensagemStatus = 'Erro ao verificar status automático.';
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



  onBackdropClick(event: Event): void {
    this.closePopup();
  }
  
  openPopupConfig(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    
    this.isPopupOpen = false;
  }
}
