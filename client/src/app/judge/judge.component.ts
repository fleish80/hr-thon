import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from './../firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Clause } from '../clause';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {
  uid: string;
  values$: Observable<any>;

  constructor(
    private activeRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe((data: Params) => {
      this.uid = data.uid;
      if (this.uid) {
        const judge$ = this.firebaseService.getJudge(data.uid);
        const projects$ = this.firebaseService.getProjects();
        this.values$ = combineLatest(judge$, projects$).pipe(
          map(([judge, projects]) => ({
            judge,
            projects
          })),
          catchError(error => {
            console.error(error);
            this.snackBarService.openFailure();
            return of(null);
          })
        );
      }
    });
  }
}
