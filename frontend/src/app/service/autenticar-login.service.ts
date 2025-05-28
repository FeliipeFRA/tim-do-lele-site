import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AutenticarService {

  private apiUrl = 'http://localhost:8000/autenticar-login';

  constructor(private http: HttpClient, private router: Router) {}

  postLogin(loginData: { email: string, password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, loginData, { headers }).pipe(
      
      tap((response) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('role', response.role);
      }),
    );
  }
}
