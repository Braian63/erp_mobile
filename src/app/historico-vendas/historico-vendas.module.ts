import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoVendasPageRoutingModule } from './historico-vendas-routing.module';

import { HistoricoVendasPage } from './historico-vendas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoVendasPageRoutingModule
  ],
  declarations: [HistoricoVendasPage]
})
export class HistoricoVendasPageModule {}
