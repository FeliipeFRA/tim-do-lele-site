import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-cfg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-cfg.component.html',
  styleUrl: './admin-cfg.component.scss'
})
export class AdminCfgComponent {
  isPopupOpen = false;

  ngOnInit(): void {

    // Aqui você pode adicionar lógica de inicialização, se necessário
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
