import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from './../firebase.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable, of, Subscriber } from 'rxjs';
import { map, tap, catchError, take } from 'rxjs/operators';
import { Clause } from '../clause';
import { SnackBarService } from '../snack-bar.service';
import { Judge } from '../judge';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit, OnDestroy {
  uid: string;
  judge: Judge;
  projects: Project[];
  loading = true;
  subscriber = new Subscriber();

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
        this.subscriber.add(
        combineLatest(judge$, projects$).pipe(take(1))
        .subscribe(([judge, projects]) => {
          if (!this.judge) {
            this.judge = judge;
          }
          if (!this.projects) {
            this.projects = projects;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error(error);
            this.snackBarService.openFailure();
            this.loading = false;
        }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
