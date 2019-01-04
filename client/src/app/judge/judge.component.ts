import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Params } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs';
import { Judge } from '../judge';
import { Clause } from '../clause';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {

  uid: string;
  judge$: Observable<Judge>;
  projects$: Observable<Project[]>;
  clauses$: Observable<Clause[]>;

  constructor(private activeRoute: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((data: Params) => {
      this.uid = data.uid;
      if (this.uid) {
        this.judge$ = this.firebaseService.getJudge(data.uid);
      }
      this.projects$ = this.firebaseService.getProjects();
      this.clauses$ = this.firebaseService.getClauses();
    });
  }

}
