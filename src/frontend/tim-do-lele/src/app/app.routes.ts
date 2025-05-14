import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TelaLoginComponent } from './components/tela-login/tela-login.component';
import { TelaCadastroComponent } from './components/tela-cadastro/tela-cadastro.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TelaInicialComponent } from './components/tela-inicial/tela-inicial.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AdminPedidosComponent } from './components/admin-pedidos/admin-pedidos.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';  // Importação do AdminGuard
import { NavbarCheckoutComponent } from './components/navbar-checkout/navbar-checkout.component'

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard], // Protege a rota home para usuários logados (usando AuthGuard)
        title: "Tim do Lelê - Página Inicial"
    },

    {
        path: 'login',
        component: TelaLoginComponent,
        title: 'Tim do Lelê - Login'
    },

    {
        path: 'cadastro',
        component: TelaCadastroComponent,
        title: 'Tim do Lelê - Cadastro'
    },

    {
        path: "admin",
        component: AdminComponent,
        title: "Tim do Lelê - Admin Login",
    },

    {
        path: "navbar",
        component: NavbarComponent,
        title: "Tim do Lelê - Navbar",
    },
    {
        path: "navbar-checkout",
        component: NavbarCheckoutComponent,
        title: "Tim do Lelê - Navbar"
    },
    {
        path: "tela-inicial",
        component: TelaInicialComponent,
        title: "Tim do Lelê - inicio",
    },
    {
        path: "perfil",
        component: PerfilComponent,
        canActivate: [AuthGuard], // Protege a rota home para usuários logados (usando AuthGuard)
        title: "Tim do Lelê - Perfil",
    },
    
    {
        path: "pedidos",
        component: AdminPedidosComponent,
        canActivate: [AuthGuard, AdminGuard], // Protege a rota pedidos para administradores (AuthGuard + AdminGuard)
        title: "Tim do Lelê - Pedidos",
    },

    {
        path: "carrinho",
        component: CarrinhoComponent,
        canActivate: [AuthGuard], // Protege a rota home para usuários logados (usando AuthGuard)
        title: "Tim do Lelê - Carrinho"
    },

    {
        path: '**',
        component: PageNotFoundComponent
    }
];
