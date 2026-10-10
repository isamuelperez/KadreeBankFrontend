import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class TransationService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);

  deposit<T>(data: any, accountId: string): Observable<T> {
    data.accountId = accountId;
    return this.http.post<T>(`${this.baseUrl}/Transaction/Consignar`, data);
  }

  withdraw<T>(data: any, accountId: string): Observable<T> {
    data.accountId = accountId;
    return this.http.post<T>(`${this.baseUrl}/Transaction/Retirar`, data);
  }

  getMonthlyCustomerTransactions<T>(year: number, month: number): Observable<{ data: T[] }> {
    return this.http.get<{ data: T[] }>(
      `${this.baseUrl}/Report/monthly-customer-transactions?year=${year}&month=${month}`,
    );
  }

  getTransactionAccountRecent(accountId: string, count: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Transaction/account/${accountId}/recent?count=${count}`,
    );
  }

  getOutOfCityWithdrawals(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Report/out-of-city-withdrawals`);
  }

  getMonthlyAccountStatement(accountId: string, year: number, month: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Report/monthly-account-statement/${accountId}?year=${year}&month=${month}`,
    );
  }
}
