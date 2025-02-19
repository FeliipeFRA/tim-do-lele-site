import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Food } from 'app/components/Food.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetPedidosService {

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<any> {
    const url = 'http://localhost:8000/pedidos';
    return this.http.get(url)
}
}
