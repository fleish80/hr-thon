import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar,
    private translateService: TranslateService) { }

  public openSuccess(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['toast-message', 'toast-success'],
      // duration: 3000,
      verticalPosition: 'top'
    });
  }

  public openFailure(message?: string) {
    if (!message) {
      message = this.translateService.instant('errorHapened');
    }
    this.snackBar.open(message, null, {
      panelClass: ['toast-message', 'toast-failure'],
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
