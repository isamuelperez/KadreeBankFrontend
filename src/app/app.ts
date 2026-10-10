import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('KadreeBankFrontend');

  items: MenuItem[] = [
    {
      label: 'Transacciones',
      icon: 'pi pi-dollar',
      routerLink: ['/transaccion'],
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      routerLink: ['/reportes'],
    },
  ];
}
