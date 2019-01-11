import { TranslateService } from "@ngx-translate/core";
import { FirebaseService } from "./../firebase.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { combineLatest, Observable, of } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import { Clause } from "../clause";
import { SnackBarService } from "../snack-bar.service";

@Component({
  selector: "app-judge",
  templateUrl: "./judge.component.html",
  styleUrls: ["./judge.component.scss"]
})
export class JudgeComponent implements OnInit {
  uid: string;
  values$: Observable<any>;
  clausesMap: Map<number, Observable<Clause[]>> = new Map<number,Observable<Clause[]>>();
  projectLoading: number;

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
        const clauses$ = this.firebaseService.getClauses();
        this.values$ = combineLatest(judge$, projects$, clauses$).pipe(
          map(([judge, projects, clauses]) => ({
            judge,
            projects,
            clauses
          })),
          tap(value => {
            this.setClausesMap(value.judge, value.projects, value.clauses);
          }),
          catchError(error => {
            console.error(error);
            this.snackBarService.openFailure();
            return of(null);
          })
        );
      }
    });
  }

  setClausesMap(judge, projects, clauses) {
    const hastProjects = judge.hasProjects;
    for (let project of projects) {
      if (hastProjects && hastProjects.includes(project.id)) {
        const clauses$ = this.firebaseService.getClausesByJudgeAndProject(
          judge,
          project
        );
        this.clausesMap.set(project.id, clauses$);
      } else {
        this.clausesMap.set(project.id, of(clauses));
      }
    }
  }

  async updateRating(judge, project: Project, clauses: Clause[]) {
    try {
      this.projectLoading = project.id;
      await this.firebaseService.setRating(judge, project, clauses);
      await this.firebaseService.updateHasProject(judge, project);
      await this.firebaseService.setProjectAvg(judge, project, clauses);
      this.firebaseService.setSummary(project).subscribe(
      //   data => {
      //   console.log('data', data);
      //   this.projectLoading = null;
      // },
        async (promise: Promise<any>) => {
          try {
            await promise;
            this.projectLoading = null;
            const message = this.translateService.instant("projectRegistred", {
              projectName: project.desc
            });
            this.snackBarService.openSuccess(message);
          } catch (error) {
            this.catchUpdateRatingError(error);
          }
        },
        error => this.catchUpdateRatingError(error)
      );
    } catch (error) {
      this.catchUpdateRatingError(error);
    }
  }

  private catchUpdateRatingError(error) {
    console.error(error);
    this.snackBarService.openFailure();
    this.projectLoading = null;
  }
}
