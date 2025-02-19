import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostLoginService {

  constructor(private http: HttpClient) {}

  postDataLogin(data: any): Observable<any>{
    const url = 'http://localhost:8000/consulta-users';
    return this.http.post(url, data);
  }
}
