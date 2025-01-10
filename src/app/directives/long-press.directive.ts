import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]',
  standalone: true
})
export class LongPressDirective {
  @Input() duration: number = 500; // Duration in milliseconds
  @Output() longPress = new EventEmitter<TouchEvent>();

  private pressTimeout: any;
  private isLongPressing = false;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.isLongPressing = false;
    this.pressTimeout = setTimeout(() => {
      this.isLongPressing = true;
      this.longPress.emit(event);
    }, this.duration);
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  @HostListener('touchmove')
  onTouchEnd() {
    clearTimeout(this.pressTimeout);
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Prevent click event if long press was triggered
    if (this.isLongPressing) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}