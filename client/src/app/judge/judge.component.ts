import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Params } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { Judge } from '../judge';
import { Clause } from '../clause';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {

  uid: string;
  judge: Judge;
  projects: Project[];
  clauses: Clause[];

  constructor(private activeRoute: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((data: Params) => {
      this.uid = data.uid;
      if (this.uid) {
        const judge$ = this.firebaseService.getJudge(data.uid);
        const projects$ = this.firebaseService.getProjects();
        const clauses$ = this.firebaseService.getClauses();
        combineLatest(
          judge$, projects$, clauses$
        ).subscribe(([judge, projects, clauses]) => {
          this.judge = judge;
          this.projects = projects;
          this.clauses = clauses;
          this.firebaseService.updateResult(judge, projects, clauses);
        }, (error: any) => { console.log(error) }
        );
      }

    });
  }

}
