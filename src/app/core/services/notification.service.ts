import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultDuration = 3000;

  /**
   * Show a success notification
   */
  success(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
