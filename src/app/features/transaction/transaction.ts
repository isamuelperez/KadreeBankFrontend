import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TransationService } from '../../core/services/transation-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccountService } from '../../core/services/account-service';
import { DialogModule } from 'primeng/dialog';

type TransactionOperation = 'deposit' | 'withdraw';

@Component({
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  selector: 'app-transaction',
  styleUrl: './transaction.css',
  templateUrl: './transaction.html',
})
export class Transaction {
  formulario: FormGroup;

  private _transactionService = inject(TransationService);
  private messageService = inject(MessageService);
  private _accountService = inject(AccountService);

  transactionType = signal<string | null>(null);
  transactionText = signal<string | null>(null);
  openDialog = signal<boolean>(false);
  private selectedOperation = signal<TransactionOperation | null>(null);

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      numeroCuenta: ['', Validators.required],
      city: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  consignar(): void {
    this.openTransactionDialog('deposit');
  }

  retirar(): void {
    this.openTransactionDialog('withdraw');
  }

  hideDialog(): void {
    this.openDialog.set(false);
  }

  Confirm(): void {
    const operation = this.selectedOperation();
    if (!operation) {
      return;
    }

    this.hideDialog();
    this.executeTransaction(operation);
  }

  private openTransactionDialog(operation: TransactionOperation): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.selectedOperation.set(operation);
    this.transactionType.set(operation === 'deposit' ? 'Confirmar consignación' : 'Confirmar retiro');
    this.transactionText.set(
      operation === 'deposit'
        ? '¿Está seguro de realizar esta consignación?'
        : '¿Está seguro de realizar este retiro?'
    );
    this.openDialog.set(true);
  }

  private executeTransaction(operation: TransactionOperation): void {
    const accountNumber = this.formulario.get('numeroCuenta')?.value;

    if (!accountNumber) {
      return;
    }
    this._accountService.GetByAccountNumber(accountNumber).subscribe({
      next: (account: { data: any } | null) => {
        if (!account?.data?.id) {
          this.messageService.add({
            severity: 'error',
            summary: 'Cuenta no encontrada',
            detail: 'Verifique el número de cuenta ingresado.',
            life: 3000,
          });
          return;
        }

        const request = operation === 'deposit'
          ? this._transactionService.deposit(this.formulario.value, account.data.id)
          : this._transactionService.withdraw(this.formulario.value, account.data.id);
        request.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: operation === 'deposit'
                ? 'Consignación realizada exitosamente'
                : 'Retiro realizado exitosamente',
              life: 3000,
            });

            this.formulario.reset();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: operation === 'deposit'
                ? 'Error al realizar consignación'
                : 'Error al realizar retiro',
              life: 3000,
            });
          },
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar cuenta',
          life: 3000,
        });
        console.error('Error al cargar cuenta:', error);
      },
    });
  }
}
