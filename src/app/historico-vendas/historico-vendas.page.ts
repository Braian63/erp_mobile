import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-historico-vendas',
  templateUrl: './historico-vendas.page.html',
  styleUrls: ['./historico-vendas.page.scss'],
})
export class HistoricoVendasPage implements OnInit {
  vendas: any[] = []; // Para armazenar os dados retornados da API

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // this.loadData();
    this.loadHistoricoVendas(); 
  }

  async loadHistoricoVendas() {
    const data = await this.apiService.getData('/vendas');
    data.subscribe(
      (data) => {
        this.vendas = data; 
      },
      (error) => {
        console.error('Erro ao carregar histórico de vendas:', error);
      }
    );
  }
}
