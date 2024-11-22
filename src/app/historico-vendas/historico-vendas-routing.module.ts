import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoVendasPage } from './historico-vendas.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricoVendasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricoVendasPageRoutingModule {}
