import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

interface StatusResponse {
  aberto: boolean;
  motivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteStatusService {

  private apiUrl = 'http://localhost:8000/api/site-status';

  constructor(private http: HttpClient) {}

  consultarStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(this.apiUrl);
  }

  atualizarStatus(aberto: boolean | null): Observable<any> {
  const role = localStorage.getItem('role') || '';

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-user-role': role
  });

  return this.http.post(this.apiUrl, { aberto }, { headers });
}
}
