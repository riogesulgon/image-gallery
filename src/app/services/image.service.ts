import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PagedImages {
  images: string[];
  totalImages: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getImages(page: number = 1): Observable<PagedImages> {
    return this.http.get<PagedImages>(`${this.apiUrl}/images`, {
      params: { page: page.toString() }
    });
  }
}
