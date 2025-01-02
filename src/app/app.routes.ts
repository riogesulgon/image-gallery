import { Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';

export const routes: Routes = [
  { path: '', component: GalleryComponent },
  { path: 'preview', component: ImagePreviewComponent },
  { path: '**', redirectTo: '' }
];
