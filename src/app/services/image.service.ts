import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ServerUrlService } from './server-url.service';

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
  constructor(
    private http: HttpClient,
    private serverUrlService: ServerUrlService
  ) {}

  getImages(page: number = 1): Observable<PagedImages> {
    const serverUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
    return this.http.get<PagedImages>(`${serverUrl}/api/images`, {
      params: { page: page.toString() }
    });
  }
}
