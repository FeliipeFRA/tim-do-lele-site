import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      // Verifica se o usuário está logado e se o role é válido
      if (!userId || !role) {
        // Se não estiver autenticado, redireciona para o login
        this.router.navigate(['/login']);
        return false;
      }

      // Se o usuário tiver o role de admin ou user, permite o acesso
      return true;
    }

    // Se não estivermos no navegador (e.g., SSR), retorna false
    return false;
  }
}
