import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface ServerInfo {
  ip: string;
  port: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServerUrlService {
  constructor(private http: HttpClient) {}

  getServerUrl(): Observable<string> {
    const serverUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
    return this.http.get<ServerInfo>(`${serverUrl}/api/server-info`).pipe(
      map(info => `http://${info.ip}:${info.port}`)
    );
  }
}
