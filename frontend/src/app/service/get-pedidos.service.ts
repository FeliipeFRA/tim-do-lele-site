import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetPedidosService {
  private apiUrl = 'http://localhost:8000/pedidos'; 

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPedidosPorData(data: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?data=${data}`);
  }
}
