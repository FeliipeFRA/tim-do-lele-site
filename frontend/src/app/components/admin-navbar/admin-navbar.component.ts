import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteStatusService } from 'app/service/site-status.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
  siteAberto: boolean | null = null;
  mensagemStatus: string = '';

  constructor(private siteStatusService: SiteStatusService) {}

  ngOnInit(): void {
    this.carregarStatus();
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
