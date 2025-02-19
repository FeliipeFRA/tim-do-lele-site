import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Service
import { CadastroService } from 'app/service/cadastro.service';

@Component({
  selector: 'app-tela-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tela-cadastro.component.html',
  styleUrl: './tela-cadastro.component.scss'
})
export class TelaCadastroComponent implements OnInit {
  email: string | undefined;
  senha: string | undefined;
  confirmar_senha: string | undefined;
  telefone: string | undefined;
  nome: string | undefined;

  constructor(
    private cadastroService: CadastroService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(form: any): void {
    const { nome, email, senha, confirmar_senha, telefone } = form.value;

    if (this.isEmptyVar(nome)) {
      return this.showAlert('Campo Nome em branco. Por favor, preencha o campo.');
    }
    if (this.isEmptyVar(email)) {
      return this.showAlert('Campo Email em branco. Por favor, preencha o campo.');
    }
    if (this.isEmptyVar(senha)) {
      return this.showAlert('Campo Senha em branco. Por favor, preencha o campo.');
    }
    if (this.isEmptyVar(confirmar_senha)) {
      return this.showAlert('Campo Confirmar Senha em branco. Por favor, preencha o campo.');
    }
    if (this.isEmptyVar(telefone)) {
      return this.showAlert('Campo Telefone em branco. Por favor, preencha o campo.');
    }
    if (senha !== confirmar_senha) {
      return this.showAlert('As senhas estão diferentes. Por favor, verifique novamente!');
    }

    // Enviar dados para o serviço de cadastro
    this.cadastroService.postDataCadastro(form.value).subscribe({
      next: () => {
        this.showSuccessAlert('Seu cadastro foi concluído com sucesso!');
        this.router.navigate(['/login']);
        form.reset();
      },
      error: (erro) => {
        console.error("Erro ao enviar cadastro ao backend.", erro);
        this.showAlert("Erro ao realizar o cadastro. Tente novamente.");
        form.reset();
      }
    });
  }

  showHiddenPass(inputId: string, iconId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const iconEye = document.getElementById(iconId) as HTMLElement;

    if (input && iconEye) {
      if (input.type === 'password') {
        input.type = 'text';
        iconEye.classList.add('ri-eye-line');
        iconEye.classList.remove('ri-eye-off-line');
      } else {
        input.type = 'password';
        iconEye.classList.remove('ri-eye-line');
        iconEye.classList.add('ri-eye-off-line');
      }
    }
  }

  private isEmptyVar(value: any): boolean {
    return value === null || value === undefined || (typeof value === "string" && value.trim() === '');
  }

  private showAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      text: message,
      confirmButtonText: 'Ok'
    });
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: 'Parabéns!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }
}
