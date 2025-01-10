import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { ServerUrlService } from './services/server-url.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ImageService } from './services/image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, QRCodeComponent, AsyncPipe, FormsModule]
})
export class AppComponent implements OnInit {
  title = 'Browsa';
  serverUrl$: Observable<string>;
  imageDirectory$: Observable<string>;
  newDirectory = '';
  updateError = '';
  isQrCodeVisible = true;
  isDirectoryVisible = true;

  toggleQrCode() {
    this.isQrCodeVisible = !this.isQrCodeVisible;
  }

  toggleDirectory() {
    this.isDirectoryVisible = !this.isDirectoryVisible;
  }

  constructor(
    private serverUrlService: ServerUrlService,
    private imageService: ImageService
  ) {
    this.serverUrl$ = this.serverUrlService.getServerUrl();
    this.imageDirectory$ = this.serverUrlService.imageDirectory$;
  }

  ngOnInit() {
    // Initialize newDirectory with current path
    this.imageDirectory$.subscribe(dir => {
      this.newDirectory = dir;
    });
  }

  updateDirectory() {
    if (!this.newDirectory) {
      this.updateError = 'Directory path cannot be empty';
      return;
    }

    this.updateError = '';
    this.serverUrlService.updateImageDirectory(this.newDirectory).subscribe({
      next: (response) => {
        if (!response.success || !response.imageDirectory) {
          this.updateError = 'Failed to update directory';
          return;
        }
        console.log('Directory updated successfully:', response.imageDirectory);
        this.imageService.refreshImages();
      },
      error: (error) => {
        console.error('Directory update error:', error);
        this.updateError = error.error?.error || 'Failed to update directory';
      }
    });
  }
}
