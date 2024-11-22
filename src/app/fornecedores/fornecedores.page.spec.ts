import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FornecedoresPage } from './fornecedores.page';

describe('FornecedoresPage', () => {
  let component: FornecedoresPage;
  let fixture: ComponentFixture<FornecedoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
