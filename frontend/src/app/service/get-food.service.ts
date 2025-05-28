import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Food } from 'app/models/Food.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Adicional } from 'app/models/Additionals.model';

@Injectable({
  providedIn: 'root'
})
export class GetFoodService {

  constructor(private http: HttpClient) {}

  getDataFood(): Observable<Food[]> {
    const url = 'http://localhost:8000/lanches';
    return this.http.get<Food[]>(url).pipe(
        catchError(error => {
            console.error('Erro ao obter lanches:', error);
            return throwError(() => new Error('Erro ao obter dados dos lanches, tente novamente mais tarde.'));
        })
    );
  }
  getDataDrinks(): Observable<Food[]> {
    const url = 'http://localhost:8000/bebidas';
    return this.http.get<Food[]>(url).pipe(
        catchError(error => {
            console.error('Erro ao obter bebidas:', error);
            return throwError(() => new Error('Erro ao obter dados das bebidas, tente novamente mais tarde.'));
        })
    );
  }
  GetDataAdditionals(): Observable<Adicional[]> {
    const url = 'http://localhost:8000/adicionais';
    return this.http.get<Adicional[]>(url).pipe(
        catchError(error => {
            console.error('Erro ao obter adicionais:', error);
            return throwError(() => new Error('Erro ao obter dados dos adicionais, tente novamente mais tarde.'));
        })
    );
  }

}
