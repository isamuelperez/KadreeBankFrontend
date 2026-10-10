import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccountService } from '../../core/services/account-service';
import { TransationService } from '../../core/services/transation-service';
import { TableModule } from 'primeng/table';

@Component({
  imports: [
    DatePipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    TableModule,
  ],
  selector: 'app-report',
  styleUrl: './report.css',
  templateUrl: './report.html',
})
export class Report {
  formulario: FormGroup;

  _accountService = inject(AccountService);

  _transactionService = inject(TransationService);

  account = signal<any | null>(null);

  listMonthlyCustomerTransactions = signal<any[]>([]);

  listrecents = signal<any[]>([]);

  lisOutOfCityWithdrawals = signal<any[]>([]);

  listMonthlyAccountStatement = signal<any>(null);

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      numeroCuenta: [''],
      city: [''],
      year: [null],
      month: [null],
    });
  }

  search(): void {
    const accountNumber = this.formulario.get('numeroCuenta')?.value;
    this._accountService.GetByAccountNumber(accountNumber).subscribe({
      next: (account: { data: any } | null) => {
        if (!account?.data?.id) {
          return;
        }
        this.account.set(account.data);
        const accountId = account.data.id;

        this._transactionService.getTransactionAccountRecent(accountId).subscribe({
          next: (resp) => {
            this.listrecents.set(resp.data);
          },
          error: (error) => {
            console.error(error);
          },
        });

        this._transactionService.getMonthlyAccountStatement(
          accountId,
          this.formulario.get('year')?.value,
          this.formulario.get('month')?.value,
        ).subscribe({
          next: (resp) => {
            this.listMonthlyAccountStatement.set(resp.data);
            console.log('Monthly Account Statement:', resp.data);
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        this.listrecents.set([]);
        this.account.set(null);
      },
    });

    this._transactionService.getMonthlyCustomerTransactions(
        this.formulario.get('year')?.value,
        this.formulario.get('month')?.value,
      ).subscribe({
        next: (resp) => {
          this.listMonthlyCustomerTransactions.set(resp.data);
        },
        error: (error) => {
          console.error(error);
        },
      });

      this._transactionService.getOutOfCityWithdrawals().subscribe({
        next: (resp) => {
          this.lisOutOfCityWithdrawals.set(resp.data);
        },
        error: (error) => {
          console.error(error);
        },
      });

  }

  clear(): void {
    this.formulario.reset();
    this.account.set(null);
    this.listrecents.set([]);
    this.listMonthlyCustomerTransactions.set([]);
    this.lisOutOfCityWithdrawals.set([]);
    this.listMonthlyAccountStatement.set(null);
  }
}
