import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], 
      password: ['', Validators.required],
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      try {
        const responseObservable = await this.apiService.postData('token/', { username, password });

        responseObservable.subscribe(
          async (response: any) => {
            const token = response.access; 
            await this.apiService.saveAuthToken(token); 
            console.log('Login bem-sucedido, token salvo:', token);

            // Redirecionar para a página principal
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Erro no login:', error);
            alert('Falha no login. Verifique suas credenciais.');
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