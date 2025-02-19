import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private http: HttpClient) {}

  postDataCadastro(data: any): Observable<any>{
    const url = 'http://localhost:8000/enviar-cadastro';
    return this.http.post(url, data);
  }
}
