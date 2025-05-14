import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

//services
import { AutenticarService } from 'app/service/autenticar-login.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(
    private autenticarService: AutenticarService,
    private router: Router,
  ) {}

  data: any [] = [];
  email: string |undefined;
  senha: string | undefined;

  // Método para validar login
  validarlogin(form: NgForm) {
  if (form.invalid) {
    console.log('Formulário inválido!');
    return;
  }

  const loginData = {
    email: form.value.email,
    password: form.value.password
  };

  this.autenticarService.postLogin(loginData).subscribe({
    next: (data) => {
      console.log("Login realizado com sucesso.");

      if (data.role === 'ADMIN') {
        this.router.navigate(['/pedidos']); // Navega para admin somente se for admin
      } else {
        // Se não for admin, mostra alerta e não navega
        this.showAlert('Acesso restrito para administradores.');
        form.reset();
      }
    },
    error: (erro) => {
      console.error("Erro ao logar na conta.", erro);
      const mensagemErro = erro?.error?.message || "Erro ao realizar o login. Tente novamente.";
      this.showAlert(mensagemErro);
      form.reset();
    }
  });
  }
  
private showAlert(message: string): void {
  Swal.fire({
    icon: 'error',
    title: 'Erro',
    text: message,
    confirmButtonText: 'Tentar Novamente',
    confirmButtonColor: '#d33',
    background: '#f8d7da',
    customClass: {
      popup: 'custom-popup',
      confirmButton: 'custom-confirm-btn',
    },
    showClass: {
      popup: 'animate__fadeIn',
    },
    hideClass: {
      popup: 'animate__bounceOut',
    },
  });
}




  //design do front
  showHiddenPass(inputId: string, iconId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const iconEye = document.getElementById(iconId) as HTMLElement;

    if (!input || !iconEye) return; // Verifica se os elementos existem

    if (input.type === 'password') {
      // Trocar para texto
      input.type = 'text';

      // Alterar ícone
      iconEye.classList.add('ri-eye-line');
      iconEye.classList.remove('ri-eye-off-line');
    } else {
      // Trocar para senha
      input.type = 'password';

      // Alterar ícone
      iconEye.classList.remove('ri-eye-line');
      iconEye.classList.add('ri-eye-off-line');
    }
  }

}
