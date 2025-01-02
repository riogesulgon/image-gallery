import { Component, OnInit } from '@angular/core';
import { ImageService, PagedImages } from '../../services/image.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GalleryComponent implements OnInit {
  images: string[] = [];
  currentPage = 1;
  totalPages = 1;
  totalImages = 0;

  constructor(
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.imageService.getImages(page).subscribe((data: PagedImages) => {
      this.images = data.images;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
      this.totalImages = data.totalImages;
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
