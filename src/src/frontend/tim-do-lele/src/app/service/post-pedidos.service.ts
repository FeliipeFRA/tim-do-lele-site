import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostPedidosService {

  constructor(private http: HttpClient) {}

  postDataPedidos(data: any): Observable<any>{
    const url = 'http://localhost:8000/post-pedidos';
    return this.http.post(url, data);
  }
}
