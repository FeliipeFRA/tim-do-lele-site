import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
  
    if (!userId || !role) {
      // Redireciona para o login se o usuário não estiver logado
      this.router.navigate(['/admin']);
      return false;
    }
  
    // Verifica se o usuário tem o role 'admin'
    if (this.router.url === '/admin' && role !== 'ADMIN') {
      // Se o usuário não for admin, redireciona para a página Home
      this.router.navigate(['/admin']);
      return false;
    }
  
    return true;
  }
}
