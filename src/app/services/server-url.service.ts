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

  private baseUrlSubject = new BehaviorSubject<string>('');
  private baseUrl$ = this.baseUrlSubject.asObservable();

  private apiUrl = '';
  private frontendUrl = '';

  private getBaseUrl(): string {
    return this.frontendUrl || (window.location.protocol + '//' + window.location.hostname + ':4200');
  }

  private getApiBaseUrl(): string {
    return this.apiUrl || (window.location.protocol + '//' + window.location.hostname + ':3000');
  }

  private getServerInfo(): Observable<ServerInfo> {
    const initialUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
    return this.http.get<ServerInfo>(`${initialUrl}/api/server-info`).pipe(
      map(info => {
        this.apiUrl = `${window.location.protocol}//${info.ip}:3000`;
        this.frontendUrl = `${window.location.protocol}//${info.ip}:4200`;
        this.baseUrlSubject.next(this.frontendUrl);
        return info;
      })
    );
  }

  getServerUrl(): Observable<string> {
    return this.baseUrl$.pipe(
      map(url => url || this.getBaseUrl())
    );
  }

  getApiUrl(): Observable<string> {
    return new Observable(subscriber => {
      subscriber.next(this.getApiBaseUrl());
      subscriber.complete();
    });
  }

  updateImageDirectory(directory: string): Observable<{success: boolean, imageDirectory: string}> {
    return this.http.post<{success: boolean, imageDirectory: string}>(
      `${this.getApiBaseUrl()}/api/update-directory`,
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
