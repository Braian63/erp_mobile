import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  clients: any[] = []; 
  vendas: any[] = []; 

  isModalOpen = false; // Controle do modal
  modalMode: 'add' | 'edit' = 'add'; // Modo do modal
  selectedClient: any = null; // Cliente selecionado para edição
  clientForm: FormGroup; // Formulário de clientes

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      CPF: ['', [Validators.required, Validators.minLength(11)]], //minLength(11)
      CEP: ['', [Validators.required, Validators.minLength(8)]], //minLength(8)
      telefone: ['', [Validators.required, Validators.minLength(10)]], //minLength(11)
    });
  }
    //  telefone - pattern('^[0-9]{10,11}$') //// cep - pattern('^[0-9]{5}-[0-9]{3}$') ///// cpf - pattern('^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}$')
  ngOnInit() {
    this.loadData(); 
  }

  async loadData() {
    try {
      const data = await this.apiService.getData('clientes/');
      data.subscribe(
        (response) => {
          console.log('Clientes carregados:', response);
          this.clients = response; 
        },
        (error) => {
          console.error('Erro ao carregar clientes:', error);
          alert('Erro ao carregar clientes. Verifique sua conexão ou o token.');
        }
      );
      const vendas = await this.apiService.getData('vendas/');
      vendas.subscribe(
        (response) => {
          console.log('Vendas carregadas:', response);
          this.vendas = response
        },
        (error) => {
          console.error('Erro ao carregar vendas:', error);
          alert('Erro ao carregar vebdas. Verifique sua conexão ou o token.');
        }
      )
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar dados. Verifique sua conexão ou o token.');
    }
  }

  openModal(mode: 'add' | 'edit', client: any = null) {
    this.modalMode = mode;
    this.isModalOpen = true;

    if (mode === 'edit' && client) {
      this.selectedClient = client;
      this.clientForm.patchValue(client); 
    } else {
      this.clientForm.reset(); 
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedClient = null;
  }
  async saveClient() {
    if (this.clientForm.valid) {
      const { nome, CPF, CEP, telefone } = this.clientForm.value;

      try {
        if (this.modalMode === 'add') {
          const response = await this.apiService.postData('clientes/', { nome, CPF, CEP, telefone });
          response.subscribe(
            (newClient) => {
              console.log('Cliente criado:', newClient);
              this.clients.push(newClient); 
              this.closeModal();
            },
            (error) => {
              console.error('Erro ao criar cliente:', error);
              alert('Erro ao criar cliente. Verifique os dados e tente novamente.');
            }
          );
        } else if (this.modalMode === 'edit') {
          const clientId = this.selectedClient.id;
          const response = await this.apiService.putData(`/clientes/${clientId}`, { nome, CPF, CEP, telefone });
          response.subscribe(
            (updatedClient) => {
              console.log('Cliente atualizado:', updatedClient);
              const index = this.clients.findIndex((c) => c.id === clientId);
              this.clients[index] = updatedClient; 
              this.closeModal();
            },
            (error) => {
              console.error('Erro ao editar cliente:', error);
              alert('Erro ao editar cliente. Verifique os dados e tente novamente.');
            }
          );
        }
      } catch (error) {
        console.error('Erro no processo de salvamento:', error);
        alert('Erro ao salvar cliente. Verifique os dados e tente novamente.');
      }
    }
  }

  async deleteClient(clientId: number) {
    try {
      const response = await this.apiService.deleteData(`/clientes/${clientId}`);
      response.subscribe(
        () => {
          console.log('Cliente excluído:', clientId);
          this.clients = this.clients.filter((c) => c.id !== clientId); // Remove o cliente da lista
        },
        (error) => {
          console.error('Erro ao excluir cliente:', error);
          alert('Erro ao excluir cliente. Tente novamente.');
        }
      );
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    }
  }

  calculateTotalSpent(clientId: number) {
    // Filtra as vendas que correspondem ao cliente
    const clientVendas = this.vendas.filter(venda => venda.cliente === clientId);
    
    // Soma o total das vendas
    const totalSpent = clientVendas.reduce((acc, venda) => acc + parseFloat(venda.total), 0);
    
    return totalSpent;
  }
  
}
