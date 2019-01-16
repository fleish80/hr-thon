import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { StarRatingModule } from 'angular-star-rating';
import { firebase } from './../environments/firebase';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JudgeComponent } from './judge/judge.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    JudgeComponent,
    RatingComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    MaterialModule,
    AngularFireModule.initializeApp(firebase),
    StarRatingModule.forRoot()
  ],
  providers: [AngularFireAuth, AngularFirestore, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
