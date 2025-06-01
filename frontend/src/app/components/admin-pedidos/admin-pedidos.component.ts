import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, HostListener, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { GetPedidosService } from 'app/service/get-pedidos.service';
import { SiteStatusService } from 'app/service/site-status.service';
import { AG_GRID_LOCALE_PT_BR } from './localeText';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, AgGridModule, RouterLink],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss'],
})
export class AdminPedidosComponent implements OnInit {
  siteAberto: boolean | null = null;
  mensagemStatus: string = '';
  userName: string | null = '';
  role: string | null = '';
  localeText = AG_GRID_LOCALE_PT_BR;
  rowData: any[] = []; // Dados da tabela

  constructor(private getPedidosService: GetPedidosService, @Inject(PLATFORM_ID) private platformId: any, private siteStatusService: SiteStatusService) {}

  columnDefs: ColDef[] = [
    { field: 'NomeUsuario', headerName: 'Nome do Usuário', flex: 2, floatingFilter: true, filter: true },
    { field: 'NomeItem', headerName: 'Lanche Pedido', flex: 3, floatingFilter: true },
    { field: 'Quantidade', headerName: 'Quantidade', flex: 1, floatingFilter: true },
    { field: 'Molhos', headerName: 'Molhos', flex: 2, floatingFilter: true },
    { field: 'StatusPedido', headerName: 'Status do Pedido', flex: 2, floatingFilter: true },
    { field: 'DataPedido', headerName: 'Data do Pedido', flex: 2, floatingFilter: true },
    { field: 'HorarioReserva', headerName: 'Horário da Reserva', flex: 2, floatingFilter: true },
  ];

  ngOnInit(): void {
    // Verificar se estamos no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.OnGridRead(); // Carregar dados ao inicializar o componente
    }

    this.carregarStatus();

    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userId');
      this.role = localStorage.getItem('role');
    }
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
  // Busca os dados e formata para o grid
  OnGridRead(): void {
    this.getPedidosService.getPedidos().subscribe({
      next: (pedidos) => {
        console.log('Pedidos recebidos:', pedidos);  // Verifique se os dados estão sendo recebidos
        this.rowData = pedidos.map((pedido: any) => ({
          NomeUsuario: pedido.NomeUsuario,
          NomeItem: pedido.NomeItem,
          Quantidade: pedido.Quantidade,
          Molhos: pedido.Molhos,
          StatusPedido: pedido.StatusPedido,
          DataPedido: pedido.DataPedido,
          HorarioReserva: pedido.HorarioReserva,
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar os pedidos:', err);
      },
    });
  }
  
}
