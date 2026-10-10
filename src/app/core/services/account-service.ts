import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class AccountService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);

  GetByAccountNumber<T>(accountNumber: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Account/${accountNumber}`);
  }
}
