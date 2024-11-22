import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
})
export class ProdutosPage implements OnInit {
  products: any[] = [];
  fornecedores: any[] = [];

  isModalOpen = false; // Controle do modal
  modalMode: 'add' | 'edit' = 'add'; // Modo do modal
  selectedProduct: any = null; 
  productForm: FormGroup; 

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      estoque_atual: [0, [Validators.required, Validators.min(0)]],
      precoCompra: [0, Validators.required],
      precoVenda: [0, Validators.required],
      fornecedor: ['', Validators.required],
      estoque_minimo: [0, Validators.required],
      estoque_maximo: [0, Validators.required],
    });
  }
  
  ngOnInit() {
    this.loadData(); 
    this.loadFornecedores();
  }

  async loadData() {
    try {
      const data = await this.apiService.getData('produtos/');
      data.subscribe(
        (response) => {
          console.log('Produtos carregados:', response);
          this.products = response; 
        },
        (error) => {
          console.error('Erro ao carregar produtos:', error);
          alert('Erro ao carregar produtos. Verifique sua conexão ou o token.');
        }
      );
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar dados. Verifique sua conexão ou o token.');
    }
  }

  async loadFornecedores() {
    try {
      const data = await this.apiService.getData('fornecedores/');
      data.subscribe(
        (response) => {
          console.log('Fornecedores carregados:', response);
          this.fornecedores = response; 
        },
        (error) => {
          console.error('Erro ao carregar Fornecedores:', error);
          alert('Erro ao carregar Fornecedores. Verifique sua conexão ou o token.');
        }
      );
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar dados. Verifique sua conexão ou o token.');
    }
  }

  openModal(mode: 'add' | 'edit', product: any = null) {
    this.modalMode = mode;
    this.isModalOpen = true;

    if (mode === 'edit' && product) {
      this.selectedProduct = product;
      this.productForm.patchValue(product); 
    } else {
      this.productForm.reset(); 
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  async saveProduct() {
    if (this.productForm.valid) {
      const { nome, descricao, precoCompra, precoVenda, estoque_atual, fornecedor, estoque_minimo, estoque_maximo} = this.productForm.value;

      try {
        console.log('Dados dos produtos' + nome, descricao,estoque_atual, precoCompra, precoVenda, fornecedor, estoque_minimo, estoque_maximo )
        if (this.modalMode === 'add') {
  
          const response = await this.apiService.postData('produtos/', { nome, descricao, precoCompra, precoVenda, estoque_atual, fornecedor, estoque_minimo, estoque_maximo });
          response.subscribe(
            (newProduct) => {
              console.log('Produto criado:', newProduct);
              this.products.push(newProduct); 
              this.closeModal();
            },
            (error) => {
              console.error('Erro ao criar produto:', error);
              alert('Erro ao criar produto. Verifique os dados e tente novamente.');
            }
          );
        } else if (this.modalMode === 'edit') {
          const productId = this.selectedProduct.id;
          const response = await this.apiService.putData(`/produtos/${productId}`, { nome, descricao, precoCompra, precoVenda, estoque_atual, fornecedor, estoque_minimo, estoque_maximo});
          response.subscribe(
            (updatedProduct) => {
              console.log('Produto atualizado:', updatedProduct);
              const index = this.products.findIndex((p) => p.id === productId);
              this.products[index] = updatedProduct;
              this.closeModal();
            },
            (error) => {
              console.error('Erro ao editar produto:', error);
              alert('Erro ao editar produto. Verifique os dados e tente novamente.');
            }
          );
        }
      } catch (error) {
        console.error('Erro no processo de salvamento:', error);
        alert('Erro ao salvar produto. Verifique os dados e tente novamente.');
      }
    }
  }

  async deleteProduct(productId: number) {
    try {
      const response = await this.apiService.deleteData(`/produtos/${productId}`);
      response.subscribe(
        () => {
          console.log('Produto excluído:', productId);
          this.products = this.products.filter((p) => p.id !== productId); 
        },
        (error) => {
          console.error('Erro ao excluir produto:', error);
          alert('Erro ao excluir produto. Tente novamente.');
        }
      );
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    }
  }
}
