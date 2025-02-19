import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

import { AG_GRID_LOCALE_PT_BR } from './localeText';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetPedidosService } from 'app/service/get-pedidos.service';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, AgGridModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss'],
})
export class AdminPedidosComponent implements OnInit {
  localeText = AG_GRID_LOCALE_PT_BR;
  rowData: any[] = []; // Dados da tabela

  constructor(private getPedidosService: GetPedidosService) {}

  columnDefs: ColDef[] = [
    { field: 'NomeUsuario', headerName: 'Nome do Usuário', flex: 2, floatingFilter: true },
    { field: 'NomeItem', headerName: 'Lanche Pedido', flex: 3, floatingFilter: true },
    { field: 'Quantidade', headerName: 'Quantidade', flex: 1, floatingFilter: true },
    { field: 'Molhos', headerName: 'Molhos', flex: 2, floatingFilter: true },
    { field: 'StatusPedido', headerName: 'Status do Pedido', flex: 2, floatingFilter: true },
    { field: 'DataPedido', headerName: 'Data do Pedido', flex: 2, floatingFilter: true },
    { field: 'HorarioReserva', headerName: 'Horário da Reserva', flex: 2, floatingFilter: true },
  ];

  ngOnInit(): void {
    this.OnGridRead(); // Carregar dados ao inicializar o componente
  }

  // Busca os dados e formata para o grid
  OnGridRead(): void {
    this.getPedidosService.getPedidos().subscribe({
      next: (pedidos) => {
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
