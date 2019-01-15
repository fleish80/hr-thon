import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule,
  MatSnackBarModule, MatTableModule, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [BrowserAnimationsModule, FlexLayoutModule],
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
    MatTabsModule
  ]
})
export class MaterialModule {}
