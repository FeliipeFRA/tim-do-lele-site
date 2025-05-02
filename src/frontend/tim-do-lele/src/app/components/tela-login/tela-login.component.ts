import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

//services
import { AutenticarService } from 'app/service/autenticar-login.service';

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tela-login.component.html',
  styleUrls: ['./tela-login.component.scss']
})

export class TelaLoginComponent {
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
  
    // Envia a requisição de login
    this.autenticarService.postLogin(loginData).subscribe({
      next: (data) => {
        console.log("Login realizado com sucesso.");
        this.router.navigate(['/home']);
        form.reset();
      },
      error: (erro) => {
        console.error("Erro ao logar na conta.", erro);
        const mensagemErro = erro?.error?.message || "Erro ao realizar o cadastro. Tente novamente.";
        this.showAlert(mensagemErro);
        form.reset();
      }
    });
  }
  
  private showAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: message,
      confirmButtonText: 'Tentar Novamente',  // Texto do botão de confirmação
      confirmButtonColor: '#d33',  // Cor do botão de confirmação
      background: '#f8d7da',  // Cor de fundo
      customClass: {
      popup: 'custom-popup',  // Classe CSS personalizada para o popup
      confirmButton: 'custom-confirm-btn',  // Classe CSS para o botão
    },
    showClass: {
      popup: 'animate__fadeIn',  // Animação de entrada
      
    },
    hideClass: {
      popup: 'animate__bounceOut',  // Animação de saída
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
