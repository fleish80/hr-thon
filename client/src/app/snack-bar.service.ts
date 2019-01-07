import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  public openSuccess(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['toast-message', 'toast-success'],
      duration: 5000
    });
  }

  public openFailure(message: string) {
    this.snackBar.open(message, null, {
      panelClass: ['toast-message', 'toast-failure'],
      duration: 5000
    });
  }

}
