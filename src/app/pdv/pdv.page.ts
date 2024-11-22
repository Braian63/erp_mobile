import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.page.html',
  styleUrls: ['./pdv.page.scss'],
})
export class PdvPage implements OnInit {
  products: any[] = [];
  cart: any[] = [];

  total = 0;

  paymentMethods: any[] = [{
    "value": "pix",
    "label": "Pix"
  },
  {
    "value": "dinheiro",
    "label": "Dinheiro"
  },
  {
    "value": "cartão de crédito",
    "label": "Cartão de Crédito"
  },
  {
    "value": "cartão de débito",
    "label": "Cartão de Débito"
  }];
  clients: any[] = [];
  selectedPaymentMethod: string = '';
  selectedClient: number = 1; 

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.loadData();
    this.loadCartFromLocalStorage();
    this.loadClients();
  }

  async loadData() {
    try {
      const data = await this.apiService.getData('produtos/');
      data.subscribe(
        (response) => {
          this.products = response;
        },
        (error) => {
          alert('Erro ao carregar produtos.');
        }
      );
    } catch {
      alert('Erro ao carregar dados.');
    }
  }

  async loadClients() {
    try {
      const data = await this.apiService.getData('clientes/');
      data.subscribe(
        (response) => {
          this.clients = response;
        },
        (error) => {
          alert('Erro ao carregar clientes.');
        }
      );
    } catch {
      alert('Erro ao carregar clientes.');
    }
  }

  addToCart(product: any) {
    const existingItem = this.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.subtotal += parseFloat(product.precoVenda);
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
        subtotal: parseFloat(product.precoVenda),
      });
    }

    this.saveCartToLocalStorage();
    this.calculateTotal();
  }

  removeFromCart(product: any, index: number) {
    if (product.quantity > 1) {
      product.quantity--;
      product.subtotal = product.quantity * product.precoVenda;
    } else {
      this.cart.splice(index, 1);
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.calculateTotal();
    }
  }

  clearCart() {
    this.cart = [];
    this.total = 0;
    localStorage.removeItem('cart');
  }

  async finalizeSale() {
    if (!this.selectedPaymentMethod) {
      alert('Por favor, selecione um método de pagamento.');
      return;
    }

    const saleData = {
      metodo_pagamento: this.selectedPaymentMethod,
      cliente: this.selectedClient,
      // total: this.total.toFixed(2),
      // data_venda: new Date().toISOString(),
    };

    console.log(saleData)

    try {
      const saleResponse = await (await this.apiService.postData('vendas/', saleData)).toPromise();
      console.log(saleResponse)
      for (const item of this.cart) {
        const itemVenda = {
          quantidade: item.quantity,
          // desconto: '0.00',
          venda: saleResponse.id,
          produto: item.id,
          // subtotal: item.subtotal.toFixed(2),
        };
        console.log(itemVenda)
        await (await this.apiService.postData('itemvendas/', itemVenda)).toPromise();
      }

      alert('Venda realizada com sucesso!');
      this.clearCart();
    } catch (error) {
      alert('Erro ao finalizar venda. Tente novamente.');
    }
  }
}