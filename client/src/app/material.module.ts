import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule,
  MatSnackBarModule, MatTableModule, MatTabsModule, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [BrowserAnimationsModule],
  exports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatSelectModule,
    MatTabsModule,
    MatSortModule
  ]
})
export class MaterialModule {}
