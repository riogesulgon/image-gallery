import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageService, PagedImages } from '../../services/image.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GalleryComponent implements OnInit, OnDestroy {
  images: string[] = [];
  currentPage = 1;
  totalPages = 1;
  totalImages = 0;
  private refreshSubscription!: Subscription;

  constructor(
    private imageService: ImageService,
    private router: Router
  ) {}

  onImageError(event: ErrorEvent, imagePath: string) {
    console.error('Image failed to load:', imagePath);
    console.error('Error event:', event);
    const imgElement = event.target as HTMLImageElement;
    console.log('Image element:', imgElement);
  }

  onImageLoad(event: Event, imagePath: string) {
    console.log('Image loaded successfully:', imagePath);
  }

  ngOnInit(): void {
    this.loadPage(1);
    this.refreshSubscription = this.imageService.getRefreshTrigger().subscribe(() => {
      console.log('Received refresh trigger in gallery component');
      this.loadPage(1); // Reset to first page when refreshing
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadPage(page: number): void {
    console.log('Loading page:', page);
    this.imageService.getImages(page).subscribe({
      next: (data: PagedImages) => {
        console.log('Received page data:', data);
        this.images = data.images;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.totalImages = data.totalImages;
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.images = [];
        this.totalImages = 0;
        this.totalPages = 1;
        this.currentPage = 1;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  openPreview(imagePath: string): void {
    this.router.navigate(['/preview'], { 
      queryParams: { image: imagePath }
    });
  }
}
