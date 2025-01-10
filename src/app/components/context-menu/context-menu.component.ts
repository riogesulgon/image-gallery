import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isVisible" 
      class="context-menu"
      [style.left.px]="position.x"
      [style.top.px]="position.y">
      <div 
        *ngFor="let item of menuItems" 
        class="menu-item"
        (click)="onItemClick(item)">
        {{ item.label }}
      </div>
    </div>
  `,
  styles: [`
    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px 0;
      min-width: 150px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
    }

    .menu-item {
      padding: 8px 16px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  `]
})
export class ContextMenuComponent {
  @Input() position: ContextMenuPosition = { x: 0, y: 0 };
  @Input() isVisible = false;
  @Input() menuItems: ContextMenuItem[] = [];
  @Output() closeMenu = new EventEmitter<void>();

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isVisible) {
      this.closeMenu.emit();
    }
  }

  onItemClick(item: ContextMenuItem): void {
    item.action();
    this.closeMenu.emit();
  }
}