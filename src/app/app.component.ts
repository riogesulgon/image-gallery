import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { ServerUrlService } from './services/server-url.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, GalleryComponent, QRCodeComponent, AsyncPipe]
})
export class AppComponent implements OnInit {
  title = 'Image Gallery';
  serverUrl$: Observable<string>;

  constructor(private serverUrlService: ServerUrlService) {
    this.serverUrl$ = this.serverUrlService.getServerUrl();
  }

  ngOnInit() {}
}
