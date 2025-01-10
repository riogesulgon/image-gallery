import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ImagePreviewComponent implements OnInit {
  imagePath: string = '';
  showDeleteConfirm: boolean = false;
  deleteMessage: string = '';
  showDeleteMessage: boolean = false;
  currentPage: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.imagePath = params['image'];
      this.currentPage = params['page'] ? parseInt(params['page']) : 1;
      if (!this.imagePath) {
        this.router.navigate(['/']);
      }
    });
  }

  closePreview(): void {
    this.router.navigate(['/'], {
      queryParams: { page: this.currentPage }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteImage(): void {
    this.imageService.deleteImage(this.imagePath).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.deleteMessage = 'Image deleted successfully';
        this.showDeleteMessage = true;
        this.imageService.refreshImages();
        
        // Navigate back after a brief delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/'], {
            queryParams: { page: this.currentPage }
          });
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting image:', error);
        this.showDeleteConfirm = false;
        this.deleteMessage = 'Error deleting image';
        this.showDeleteMessage = true;
        
        // Hide the error message after 3 seconds
        setTimeout(() => {
          this.showDeleteMessage = false;
        }, 3000);
      }
    });
  }
}
