import { Injectable } from '@angular/core';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarConfig,
  MatSnackBarModule,
  MatSnackBar
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FlashService {
  constructor(public snackBar: MatSnackBar) {}

  message = 'Snack Bar opened.';
  actionButtonLabel = 'okay'.toUpperCase();
  action = true;
  setAutoHide = true;
  autoHide = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  open(
    message: string,
    typ: string,
    ontapped?: () => void,
    buttonText?: string,
    duration?: number
  ) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    config.duration = duration || 5000;
    config.panelClass = typ;

    this.snackBar
      .open(message, buttonText || this.actionButtonLabel, config)
      .onAction()
      .subscribe(() => {
        if (ontapped !== null && ontapped !== undefined) {
          ontapped();
        }
      });
  }
}
