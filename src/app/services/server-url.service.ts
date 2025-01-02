import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerUrlService {
  constructor(private http: HttpClient) {}

  getServerUrl(): Observable<string> {
    // Extract the base URL from an image URL
    return this.http.get<any>('http://localhost:3000/api/images').pipe(
      map(response => {
        if (response.images && response.images.length > 0) {
          const imageUrl = new URL(response.images[0]);
          return `${imageUrl.protocol}//${imageUrl.host}`;
        }
        return 'http://localhost:3000'; // Fallback
      })
    );
  }
}
