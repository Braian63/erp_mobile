import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  clientes: number = 0;
  vendasMes: number = 0;
  vendasHoje: number = 0;
  topProducts: { nome: string; quantidade: number }[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadClientes(); 
    this.loadProdMaisVendidos()
  }

  async loadClientes() {
    try {
      const data = await this.apiService.getData('clientes/');
      data.subscribe(
        (response) => {
          console.log('clientes carregados:', response);
          this.clientes = response.length; 
        },
        (error) => {
          console.error('Erro ao carregar clientes:', error);
          alert('Erro ao carregar clientes. Verifique sua conexão ou o token.');
        }
      );
      const vendas = await this.apiService.getData('vendas/');
      vendas.subscribe((response) => {
        this.vendasMes = this.getMonthlySales(response);
        this.vendasHoje = this.getDailySales(response);
      });
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar dados. Verifique sua conexão ou o token.');
    }
  }

  getMonthlySales(sales: any[]): number {
    const currentMonth = new Date().getMonth(); // Mês atual (índice baseado em 0)
  
    return sales
      .filter((sale) => {
        const saleDate = new Date(sale.data_venda); // Converte para Date
        return saleDate.getMonth() === currentMonth; // Compara o mês
      })
      .reduce((total, sale) => total + parseFloat(sale.total), 0); // Soma os valores como números
  }
  
  getDailySales(sales: any[]): number {
    const today = new Date().toISOString().split('T')[0]; // Data atual no formato "YYYY-MM-DD"
  
    return sales
      .filter((sale) => {
        const saleDate = new Date(sale.data_venda).toISOString().split('T')[0]; // Converte e formata a data
        return saleDate === today; // Compara as datas
      })
      .reduce((total, sale) => total + parseFloat(sale.total), 0); // Soma os valores como números
  }
  
  async loadProdMaisVendidos() {
    try {
      const itemVendasData = await this.apiService.getData('itemvendas/');
      itemVendasData.subscribe(
        async (itemVendasResponse) => {
          console.log('ItemVendas carregados:', itemVendasResponse);
  
          // Busca os dados de Produtos
          const ProdutosData = await this.apiService.getData('produtos/');
          ProdutosData.subscribe(
            (produtosResponse) => {
              console.log('Produtos carregados:', produtosResponse);
  
              // Calcula os produtos mais vendidos
              this.topProducts = this.calculateTopProducts(itemVendasResponse, produtosResponse);
            },
            (error) => {
              console.error('Erro ao carregar produtos:', error);
              alert('Erro ao carregar produtos. Verifique sua conexão ou o token.');
            }
          );
        },
        (error) => {
          console.error('Erro ao carregar ItemVendas:', error);
          alert('Erro ao carregar ItemVendas. Verifique sua conexão ou o token.');
        }
      );
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar dados. Verifique sua conexão ou o token.');
    }
  }
  
  calculateTopProducts(itemVendas: any[], produtos: any[]) {
    const productSales: { [key: number]: number } = {};
  
    // Soma as quantidades vendidas por produto
    itemVendas.forEach(item => {
      productSales[item.produto] = (productSales[item.produto] || 0) + item.quantidade;
    });
  
    // Combina os dados com os nomes dos produtos
    const topProducts = Object.entries(productSales).map(([id, quantidade]) => {
      const produto = produtos.find(p => p.id === Number(id));
      return { nome: produto?.nome || 'Produto Desconhecido', quantidade: quantidade as number };
    });
  
    return topProducts.sort((a, b) => b.quantidade - a.quantidade);
  }
  

}

