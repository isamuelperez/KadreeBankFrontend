import { Routes } from '@angular/router';
import { Report } from './features/report/report';
import { Transaction } from './features/transaction/transaction';

export const routes: Routes = [
    { path: 'transaccion', component: Transaction },
    { path: 'reportes', component: Report },
];
