import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container" [class]="severity">
      <div class="error-content">
        <mat-icon>{{ icon }}</mat-icon>
        <div class="error-text">
          <p class="error-title">{{ title }}</p>
          <p class="error-message">{{ message }}</p>
        </div>
      </div>
      @if (showRetry) {
        <button mat-stroked-button (click)="retry.emit()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      }
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .error-container.error {
      background: #fdecea;
      color: #d32f2f;
    }

    .error-container.warning {
      background: #fff3cd;
      color: #856404;
    }

    .error-container.info {
      background: #e3f2fd;
      color: #1976d2;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .error-text {
      text-align: left;
    }

    .error-title {
      font-weight: 500;
      margin: 0 0 0.25rem;
    }

    .error-message {
      margin: 0;
      opacity: 0.8;
    }

    mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() title = 'Error';
  @Input() message = 'An unexpected error occurred.';
  @Input() severity: 'error' | 'warning' | 'info' = 'error';
  @Input() showRetry = false;
  @Output() retry = new EventEmitter<void>();

  get icon(): string {
    switch (this.severity) {
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'error';
    }
  }
}
