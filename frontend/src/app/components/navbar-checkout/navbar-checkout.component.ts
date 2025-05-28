import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navbar-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-checkout.component.html',
  styleUrl: './navbar-checkout.component.scss'
})
export class NavbarCheckoutComponent {

}
