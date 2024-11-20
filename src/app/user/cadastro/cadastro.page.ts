import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router 
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async signup() {
    if (this.signupForm.valid) {
      const { username,email, password, confirmPassword } = this.signupForm.value;

      if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }

      try {
        console.log("Dados: " + username, email, password)
        const responseObservable = await this.apiService.postData('user/', { username,email, password }, false);

        responseObservable.subscribe(
          async (response: any) => {
            console.log('Cadastro bem-sucedido:', response);
            alert('Cadastro realizado com sucesso!');
            this.router.navigate(['/login']); // Redirecionar para login após o cadastro
          },
          (error) => {
            console.error('Erro no cadastro:', error);
            alert('Falha no cadastro. Tente novamente.');
          }
        );
      } catch (error) {
        console.error('Erro inesperado:', error);
      }
    } else {
      alert('Preencha todos os campos.');
    }
  }
}
