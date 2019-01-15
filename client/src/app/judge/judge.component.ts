import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Subscriber } from 'rxjs';
import { take } from 'rxjs/operators';
import { Judge } from '../models/judge';
import { FirebaseService } from '../services/firebase.service/firebase.service';
import { SnackBarService } from '../services/snack-bar.service/snack-bar.service';
import { MatAccordion } from '@angular/material';

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
  admin: boolean;
  subscriber = new Subscriber();
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private activeRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    const snapshot = this.activeRoute.snapshot;
      this.uid = snapshot.params.uid;
      this.admin = snapshot.data.admin;
      if (this.uid) {
        const judge$ = this.firebaseService.getJudge(this.uid);
        const projects$ = this.firebaseService.getProjects();
        this.subscriber.add(
          combineLatest(judge$, projects$).pipe(take(1))
            .subscribe(([judge, projects]) => {
              this.judge = judge;
              this.projects = projects;
              this.loading = false;
            },
            (error: any) => {
              console.error(error);
              this.snackBarService.openFailure();
              this.loading = false;
            }));
      }
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  closeAll() {
    this.accordion.closeAll();
  }
}
