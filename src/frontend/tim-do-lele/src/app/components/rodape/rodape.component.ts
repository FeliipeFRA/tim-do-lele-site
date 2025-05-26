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

}
