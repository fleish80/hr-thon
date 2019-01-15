import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, Subscriber } from 'rxjs';
import { take } from 'rxjs/operators';
import { Clause } from 'src/app/models/clause';
import { Judge } from 'src/app/models/judge';
import { SnackBarService } from 'src/app/services/snack-bar.service/snack-bar.service';
import { FirebaseService } from '../services/firebase.service/firebase.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit, OnDestroy {
  @Input() judge: Judge;
  @Input() project: Project;
  @Input() admin: boolean;
  @Output() update = new EventEmitter();
  clauses: Clause[];
  ctrlMap: Map<string, FormControl> = new Map<string, FormControl>();
  form: FormGroup;
  loading = true;
  subscriber = new Subscriber();

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.setClauses();
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  private initForm() {
    this.form = this.formBuilder.group({});
    for (const clause of this.clauses) {
      const formControl = new FormControl(clause.rating || 0, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]);
      this.ctrlMap.set(clause.title, formControl);
      this.form.addControl(clause.title, formControl);
    }
  }

  private setClauses() {
    const hastProjects = this.judge.hasProjects;
    let clauses$: Observable<Clause[]>;
    if (hastProjects && hastProjects.includes(this.project.id)) {
      clauses$ = this.firebaseService.getClausesByJudgeAndProject(
        this.judge,
        this.project
      );
    } else {
      clauses$ = this.firebaseService.getClauses();
    }
    this.subscriber.add(
      combineLatest(
        clauses$,
        this.firebaseService.getProjectRating(this.judge, this.project)
      )
        .pipe(take(1))
        .subscribe(
          ([clauses, average]) => {
            this.clauses = clauses;
            this.project.average = average;
            this.initForm();
            this.loading = false;
          },
          (error: any) => {
            this.catchUpdateRatingError(error);
          }
        )
    );
  }

  async submit() {
    if (this.form.valid) {
      const clauses = Object.assign(this.clauses);
      clauses.forEach((clause: Clause) => {
        clause.rating = this.form.value[clause.title];
      });
      try {
        this.loading = true;
        await this.firebaseService.setRating(this.judge, this.project, clauses);
        await this.firebaseService.updateHasProject(this.judge, this.project);
        await this.firebaseService.setProjectAvg(
          this.judge,
          this.project,
          clauses
        );
        this.subscriber.add(
          this.firebaseService
            .setSummary(this.project)
            .pipe(take(1))
            .subscribe(
              async (promise: Promise<any>) => {
                try {
                  await promise;
                  const message = this.translateService.instant(
                    'projectRegistred',
                    {
                      projectName: this.project.desc
                    }
                  );
                  this.snackBarService.openSuccess(message);
                  this.loading = false;
                  this.update.emit();
                } catch (error) {
                  this.catchUpdateRatingError(error);
                }
              },
              error => this.catchUpdateRatingError(error)
            )
        );
      } catch (error) {
        this.catchUpdateRatingError(error);
      }
    }
  }

  private catchUpdateRatingError(error) {
    console.error(error);
    this.snackBarService.openFailure();
    this.loading = false;
  }
}
