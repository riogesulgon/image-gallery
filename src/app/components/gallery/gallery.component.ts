import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageService, PagedImages } from '../../services/image.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ContextMenuComponent, ContextMenuItem, ContextMenuPosition } from '../context-menu/context-menu.component';
import { LongPressDirective } from '../../directives/long-press.directive';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule, ContextMenuComponent, LongPressDirective]
})
export class GalleryComponent implements OnInit, OnDestroy {
  images: string[] = [];
  currentPage = 1;
  totalPages = 1;
  totalImages = 0;
  showImageNames = false;

  // Context menu properties
  contextMenuPosition: ContextMenuPosition = { x: 0, y: 0 };
  showContextMenu = false;
  selectedImage: string | null = null;
  contextMenuItems: ContextMenuItem[] = [];

  getImageName(path: string): string {
    return path.split('/').pop() || '';
  }

  onContextMenu(event: MouseEvent, image: string): void {
    event.preventDefault();
    this.selectedImage = image;
    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.updateContextMenuItems();
    this.showContextMenu = true;
  }

  onLongPress(event: TouchEvent, image: string): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.selectedImage = image;
    this.contextMenuPosition = {
      x: touch.clientX,
      y: touch.clientY
    };
    this.updateContextMenuItems();
    this.showContextMenu = true;
  }

  private updateContextMenuItems(): void {
    if (!this.selectedImage) return;
    
    this.contextMenuItems = [
      {
        label: 'Open in Preview',
        action: () => this.openPreview(this.selectedImage!)
      },
      {
        label: 'Open in New Tab',
        action: () => window.open(this.selectedImage!, '_blank')
      },
      {
        label: 'Download Image',
        action: () => {
          const link = document.createElement('a');
          link.href = this.selectedImage!;
          link.download = this.getImageName(this.selectedImage!);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    ];
  }

  closeContextMenu(): void {
    this.showContextMenu = false;
    this.selectedImage = null;
  }
  private refreshSubscription!: Subscription;

  constructor(
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
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
    // Check for page parameter in URL
    this.route.queryParams.subscribe((params: Params) => {
      const page = params['page'] ? parseInt(params['page']) : 1;
      this.loadPage(page);
    });

    this.refreshSubscription = this.imageService.getRefreshTrigger().subscribe(() => {
      console.log('Received refresh trigger in gallery component');
      this.loadPage(this.currentPage); // Maintain current page when refreshing
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
      queryParams: {
        image: imagePath,
        page: this.currentPage
      }
    });
  }
}
