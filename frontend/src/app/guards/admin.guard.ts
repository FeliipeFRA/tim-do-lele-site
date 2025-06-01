import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  if (!isBrowser) {
    console.warn('Tentativa de acesso fora do navegador.');
    router.navigate(['/login']);
    return false;
  }

  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (!userId || !role) {
    router.navigate(['/login']);
    return false;
  }

  if (state.url.startsWith('/pedidos') && role !== 'ADMIN') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
