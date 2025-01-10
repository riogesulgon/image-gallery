import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

interface ServerInfo {
  ip: string;
  port: number;
  imageDirectory: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerUrlService {
  private imageDirectorySubject = new BehaviorSubject<string>('');
  imageDirectory$ = this.imageDirectorySubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize the directory path
    this.getServerInfo().subscribe(info => {
      this.imageDirectorySubject.next(info.imageDirectory);
    });
  }

  private getBaseUrl(): string {
    return window.location.protocol + '//' + window.location.hostname + ':3000';
  }

  private getServerInfo(): Observable<ServerInfo> {
    return this.http.get<ServerInfo>(`${this.getBaseUrl()}/api/server-info`);
  }

  getServerUrl(): Observable<string> {
    return new Observable(subscriber => {
      subscriber.next(this.getBaseUrl());
      subscriber.complete();
    });
  }

  updateImageDirectory(directory: string): Observable<{success: boolean, imageDirectory: string}> {
    return this.http.post<{success: boolean, imageDirectory: string}>(
      `${this.getBaseUrl()}/api/update-directory`,
      { directory }
    ).pipe(
      map(response => {
        if (response.success) {
          this.imageDirectorySubject.next(response.imageDirectory);
        }
        return response;
      })
    );
  }
}
