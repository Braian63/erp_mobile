import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoVendasPage } from './historico-vendas.page';

describe('HistoricoVendasPage', () => {
  let component: HistoricoVendasPage;
  let fixture: ComponentFixture<HistoricoVendasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoVendasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
