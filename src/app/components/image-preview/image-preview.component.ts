import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ImagePreviewComponent implements OnInit {
  imagePath: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.imagePath = params['image'];
      if (!this.imagePath) {
        this.router.navigate(['/']);
      }
    });
  }

  closePreview(): void {
    this.router.navigate(['/']);
  }
}
