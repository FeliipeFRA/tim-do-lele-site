import { Component } from '@angular/core';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [],
  templateUrl: './rodape.component.html',
  styleUrl: './rodape.component.scss'
})
export class RodapeComponent {
  openWhatsapp() {
    window.open(
      'https://wa.me/5516992241633?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido',
      '_blank'
    );
  }
  openMaps() {
    window.open(
      'https://maps.app.goo.gl/6in3yc1iRE1B8iwt6',
      '_blank'
    );
  }

}
