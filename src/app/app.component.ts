import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showMenu = true;

  constructor(private router: Router, private menuController: MenuController) {
    // Escuta mudanças na rota para determinar se o menu será exibido
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !['/login', '/cadastro'].includes(event.url); // Define onde o menu não aparece
      }
    });
  }

  // Fecha o menu ao selecionar uma opção
  closeMenu() {
    this.menuController.close();
  }
}
