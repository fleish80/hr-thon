import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Clause } from '../clause';
import { FirebaseService } from '../firebase.service';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {

  uid: string;
  values$: Observable<any>;
  clausesMap: Map<number, Clause[]> = new Map<number, Clause[]>();

  constructor(private activeRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((data: Params) => {
      this.uid = data.uid;
      if (this.uid) {
        const judge$ = this.firebaseService.getJudge(data.uid);
        const projects$ = this.firebaseService.getProjects();
        const clauses$ = this.firebaseService.getClauses();
        this.values$ = combineLatest(
          judge$, projects$, clauses$).pipe(
            map(([judge, projects, clauses]) => ({
              judge, 
              projects, 
              clauses
            })),
            tap((value) => {this.setClausesMap(value.judge, value.projects, value.clauses)})
          );
      }
    });
  }

  setClausesMap(judge, projects, clauses) {
    const hastProjects = judge.hasProjects;
    for (let project of projects) {
      if (hastProjects && hastProjects.includes(project.id)) {
        this.firebaseService.getClausesByJudgeAndProject(judge, project).subscribe((clauses: Clause[]) => {
          this.clausesMap.set(project.id, clauses);
        })
      } else {
        this.clausesMap.set(project.id, clauses);
      }
    }
  }

  updateRating(judge, project: Project, clauses: Clause[]) {
    this.firebaseService.setRating(judge, project, clauses);
  }

}
