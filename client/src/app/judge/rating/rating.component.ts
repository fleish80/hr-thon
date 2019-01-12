import { FirebaseService } from './../../firebase.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Clause } from 'src/app/clause';
import { Judge } from 'src/app/judge';
import { Subscriber } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SnackBarService } from 'src/app/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit, OnDestroy {

  @Input() judge: Judge;
  @Input() project: Project;
  clauses: Clause[];
  ctrlMap: Map<string, FormControl> = new Map<string, FormControl>();
  form: FormGroup;
  loading = false;
  subscriber = new Subscriber();

  constructor(private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.setClauses();
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  private initForm() {
    this.form = this.formBuilder.group({});
      this.clauses.forEach((clause: Clause) => {
        const formControl = new FormControl(clause.rating || 0,
          [Validators.required,
          Validators.min(1),
          Validators.max(10)]);
        this.ctrlMap.set(clause.title, formControl);
        this.form.addControl(clause.title, formControl);
      });
    }

  private setClauses() {
    const hastProjects = this.judge.hasProjects;
    let clauses$;
    if (hastProjects && hastProjects.includes(this.project.id)) {
      clauses$ = this.firebaseService
      .getClausesByJudgeAndProject(this.judge, this.project);
    } else {
      clauses$ = this.firebaseService.getClauses();
    }
    this.subscriber.add(
    clauses$.pipe(
      finalize(() => this.loading = false)
    ).subscribe((clauses: Clause[]) => {
      this.clauses = clauses;
      this.initForm();
    },
    (error: any) => {
      this.catchUpdateRatingError(error);
    }));
  }

  async submit() {
    if (this.form.valid) {
    this.clauses.forEach((clause: Clause) => {
      clause.rating = this.form.value[clause.title];
    });
    try {
      await this.firebaseService.setRating(this.judge, this.project, this.clauses);
      await this.firebaseService.updateHasProject(this.judge, this.project);
      await this.firebaseService.setProjectAvg(this.judge, this.project, this.clauses);
      this.loading = true;
      this.subscriber.add(
      this.firebaseService.setSummary(this.project).pipe(
        finalize(() => this.loading = false)
      ).subscribe(
        async (promise: Promise<any>) => {
          try {
            await promise;
            const message = this.translateService.instant('projectRegistred', {
              projectName: this.project.desc
            });
            this.snackBarService.openSuccess(message);
          } catch (error) {
            this.catchUpdateRatingError(error);
          }
        },
        error => this.catchUpdateRatingError(error)
      ));
    } catch (error) {
      this.catchUpdateRatingError(error);
    }
  }
}

  private catchUpdateRatingError(error) {
    console.error(error);
    this.snackBarService.openFailure();
  }

}
