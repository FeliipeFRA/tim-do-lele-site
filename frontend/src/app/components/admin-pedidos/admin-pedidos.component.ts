import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { GetPedidosService } from 'app/service/get-pedidos.service';
import { SiteStatusService } from 'app/service/site-status.service';
import { AG_GRID_LOCALE_PT_BR } from './localeText';
import { isPlatformBrowser } from '@angular/common';
import { format, parse, differenceInMinutes } from 'date-fns';

interface Pedido {
  PedidoID: number;
  NomeUsuario: string;
  NomeLanche: string;
  Quantidade: number;
  Molhos: string;
  StatusPedido: string;
  DataPedido: string;
  HorarioReserva: string;
  Observacoes: string;
  Adicionais: string;
  TempoEspera?: string;
  // ... outros campos se necessário
}

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss'],
})
export class AdminPedidosComponent implements OnInit {
  siteAberto: boolean | null = null;
  mensagemStatus: string = '';
  userName: string | null = '';
  role: string | null = '';
  localeText = AG_GRID_LOCALE_PT_BR;
  rowData: Pedido[] = [];
  pedidosAgrupados: { [status: string]: Pedido[] } = {};
  toastMsg: string = '';
  showToast: boolean = false;
  undoTimeout: any = null;
  pedidoBackup: { pedido: Pedido, statusAnterior: string } | null = null;
  dataSelecionada: string = '';

  constructor(private getPedidosService: GetPedidosService, @Inject(PLATFORM_ID) private platformId: any, private siteStatusService: SiteStatusService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dataSelecionada = format(new Date(), 'yyyy-MM-dd');
      this.OnGridRead();
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

  OnGridRead(): void {
    this.getPedidosService.getPedidosPorData(this.dataSelecionadaFormatada).subscribe({
      next: (pedidos) => {
        this.rowData = pedidos.map((pedido: any) => ({
          PedidoID: pedido.PedidoID,
          NomeUsuario: pedido.NomeUsuario,
          NomeLanche: pedido.NomeLanche,
          Quantidade: pedido.Quantidade,
          Molhos: pedido.Molhos,
          StatusPedido: pedido.StatusPedido,
          DataPedido: pedido.DataPedido,
          HorarioReserva: pedido.HorarioReserva,
          Observacoes: pedido.Observacoes,
          Adicionais: (() => {
            if (!pedido.Adicionais) return '';
            try {
              const arr = typeof pedido.Adicionais === 'string' ? JSON.parse(pedido.Adicionais) : pedido.Adicionais;
              if (Array.isArray(arr)) {
                return arr.map((a: any) => a.NOME || a.name).join(', ');
              }
              return '';
            } catch {
              return '';
            }
          })(),
          TempoEspera: this.calcularTempoEspera(pedido.DataPedido, pedido.HorarioReserva)
        }));
        this.agruparPedidosPorStatus();
      },
      error: (err) => {
        console.error('Erro ao buscar os pedidos:', err);
      },
    });
  }

  calcularTempoEspera(dataPedido: string, horarioReserva: string): string {
    try {
      const agora = new Date();
      const [dia, mes, ano] = dataPedido.split('/');
      const [hora, minuto] = horarioReserva.split(':');
      const dataHoraPedido = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));
      const minutos = differenceInMinutes(agora, dataHoraPedido);
      if (minutos < 1) return 'agora';
      if (minutos < 60) return `${minutos} min`;
      const horas = Math.floor(minutos / 60);
      return `${horas}h ${minutos % 60}min`;
    } catch {
      return '-';
    }
  }

  showToastMsg(msg: string, allowUndo: boolean = false) {
    this.toastMsg = msg;
    this.showToast = true;
    if (this.undoTimeout) clearTimeout(this.undoTimeout);
    if (allowUndo) {
      this.undoTimeout = setTimeout(() => {
        this.showToast = false;
        this.pedidoBackup = null;
      }, 5000);
    } else {
      setTimeout(() => this.showToast = false, 2500);
    }
  }

  desfazerUltimaAcao() {
    if (!this.pedidoBackup) return;
    const { pedido, statusAnterior } = this.pedidoBackup;
    fetch(`http://localhost:8000/pedidos/${pedido.PedidoID}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusAnterior })
    })
      .then(res => res.json())
      .then(() => {
        this.rowData = this.rowData.map(p =>
          p.PedidoID === pedido.PedidoID ? { ...p, StatusPedido: statusAnterior } : p
        );
        this.agruparPedidosPorStatus();
        this.showToastMsg(`Ação desfeita! Pedido #${pedido.PedidoID} voltou para ${statusAnterior}.`);
      })
      .catch(() => {
        this.showToastMsg('Erro ao desfazer ação!', false);
      });
    this.pedidoBackup = null;
    this.showToast = false;
  }

  onDataChange(event: any) {
    this.dataSelecionada = event.target.value;
    this.OnGridRead();
  }

  get statusList() {
    return Object.keys(this.pedidosAgrupados);
  }

  get dataSelecionadaFormatada() {
    if (!this.dataSelecionada) return '';
    // Corrigir timezone e garantir formato dd/MM/yyyy
    const [ano, mes, dia] = this.dataSelecionada.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  agruparPedidosPorStatus() {
    this.pedidosAgrupados = {};
    for (const pedido of this.rowData) {
      if (!this.pedidosAgrupados[pedido.StatusPedido]) {
        this.pedidosAgrupados[pedido.StatusPedido] = [];
      }
      this.pedidosAgrupados[pedido.StatusPedido].push(pedido);
    }
  }

  atualizarStatusPedido(pedidoId: number, novoStatus: string) {
    const pedido = this.rowData.find(p => p.PedidoID === pedidoId);
    if (!pedido) return;
    const statusAnterior = pedido.StatusPedido;
    // Backup para desfazer
    this.pedidoBackup = { pedido: { ...pedido }, statusAnterior };
    fetch(`http://localhost:8000/pedidos/${pedidoId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    })
      .then(res => res.json())
      .then(() => {
        this.rowData = this.rowData.map(p =>
          p.PedidoID === pedidoId ? { ...p, StatusPedido: novoStatus, TempoEspera: this.calcularTempoEspera(p.DataPedido, p.HorarioReserva) } : p
        );
        this.agruparPedidosPorStatus();
        this.showToastMsg(`Pedido #${pedidoId} marcado como ${novoStatus}.`, true);
      })
      .catch(() => {
        this.showToastMsg('Erro ao atualizar status do pedido!', false);
      });
  }
}
