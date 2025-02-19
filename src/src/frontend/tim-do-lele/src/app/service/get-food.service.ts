import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Food } from 'app/components/Food.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
}
