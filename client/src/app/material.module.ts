import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule,
  MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule,
  MatMenuModule, MatRippleModule, MatSelectModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule
  ],
  exports: [MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule]
})
export class MaterialModule { }
