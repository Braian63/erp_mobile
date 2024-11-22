import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.page.html',
  styleUrls: ['./fornecedores.page.scss'],
})
export class FornecedoresPage implements OnInit {
  fornecedores: any[] = [];
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  fornecedorForm: FormGroup;
  currentFornecedor: any = null;

  constructor(
    private fb: FormBuilder,
    private ApiService: ApiService  // Injeção do serviço
  ) {
    this.fornecedorForm = this.fb.group({
      razaoSocial: [''],
      nomeFantasia: [''],
      CNPJ: [''],
      CEP: [''],
      telefone: [''],
      email: [''],
    });
  }

  ngOnInit() {
    this.loadFornecedores();  // Carregar os fornecedores ao inicializar o componente
  }

  // Método para carregar fornecedores da API
  async loadFornecedores() {
    const FornecedoresData = await this.ApiService.getData('/fornecedores')
    FornecedoresData.subscribe(
      (data) => {
        this.fornecedores = data;
      },
      (error) => {
        console.error('Erro ao carregar fornecedores:', error);
      }
    );
  }

  openModal(mode: 'add' | 'edit', fornecedor?: any) {
    this.modalMode = mode;
    this.isModalOpen = true;

    if (mode === 'edit' && fornecedor) {
      this.currentFornecedor = fornecedor;
      this.fornecedorForm.patchValue(fornecedor);
    } else {
      this.fornecedorForm.reset();
      this.currentFornecedor = null;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async saveFornecedor() {
    
    const {razaoSocial, nomeFantasia,CNPJ,CEP,telefone,email} = this.fornecedorForm.value;
    console.log({razaoSocial, nomeFantasia,CNPJ,CEP,telefone,email})

    if (this.modalMode === 'add') {
      const response = await this.ApiService.postData('fornecedores/',{razaoSocial, nomeFantasia,CNPJ,CEP,telefone,email}, true)
      response.subscribe(
        (newData) => {
          this.fornecedores.push(newData);
          this.closeModal();
        },
        (error) => {
          console.error('Erro ao adicionar fornecedor:', error);
        }
      );
    } else if (this.modalMode === 'edit') {
      const UpdData = await this.ApiService.putData(`/fornecedores/${this.currentFornecedor.id}`, {razaoSocial, nomeFantasia,CNPJ,CEP,telefone,email})
      UpdData.subscribe(
        (response) => {
          const index = this.fornecedores.findIndex(f => f.id === this.currentFornecedor.id);
          if (index > -1) {
            this.fornecedores[index] = response;
          }
          this.closeModal();
        },
        (error) => {
          console.error('Erro ao editar fornecedor:', error);
        }
      );
    }
  }

  async deleteFornecedor(id: number) {
    const response = await this.ApiService.deleteData(`/fornecedores/${id}`);
    response.subscribe(
      () => {
        this.fornecedores = this.fornecedores.filter(f => f.id !== id);
      },
      (error) => {
        console.error('Erro ao excluir fornecedor:', error);
      }
    );
  }
}
