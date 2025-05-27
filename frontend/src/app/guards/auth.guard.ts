import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verifica se o código está sendo executado no navegador
    if (typeof window !== 'undefined') {
      // Recupera o userId e o role do localStorage
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      // Log para verificar os valores armazenados no localStorage
      console.log('Verificando no localStorage:', { userId, role });

      // Verifica se o usuário está autenticado
      if (!userId || !role) {
        console.log('Usuário não autenticado, redirecionando para o login...');
        // Se não estiver autenticado, redireciona para a página de login
        this.router.navigate(['/login']);
        return false;
      }

      // Se o usuário estiver autenticado, permite o acesso à página
      return true;
    }

    // Se não estivermos no navegador (por exemplo, durante a renderização no servidor), retorna false
    return false;
  }
}
