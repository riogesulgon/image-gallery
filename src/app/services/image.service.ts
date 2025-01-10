import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, switchMap, map } from 'rxjs';
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
  private refreshTrigger = new Subject<void>();
  private currentPage = 1;

  constructor(
    private http: HttpClient,
    private serverUrlService: ServerUrlService
  ) {}

  private resetPage(): void {
    this.currentPage = 1;
  }

  getImages(page: number = 1): Observable<PagedImages> {
    return this.serverUrlService.getApiUrl().pipe(
      switchMap(apiUrl => {
        console.log('API URL:', apiUrl);
        return this.http.get<PagedImages>(`${apiUrl}/api/images`, {
          params: { page: page.toString() }
        }).pipe(
          map((response: PagedImages) => {
            console.log('API Response:', response);
            const result = {
              ...response,
              images: response.images.map((imagePath: string) => {
                const fullPath = `${apiUrl}${imagePath}`;
                console.log('Full image path:', fullPath);
                return fullPath;
              })
            };
            console.log('Final result:', result);
            return result;
          })
        );
      })
    );
  }

  refreshImages(): void {
    this.resetPage();
    console.log('Triggering image refresh');
    this.refreshTrigger.next();
  }

  getRefreshTrigger(): Observable<void> {
    return this.refreshTrigger.asObservable();
  }
}
