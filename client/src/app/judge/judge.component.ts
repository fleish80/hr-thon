import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Params } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {

  judge: Observable<any>;

  constructor(private activeRoute: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((data: Params) => {
      console.log('uid', data['uid']);
      this.judge = this.firebaseService.getJudge(data['uid']);
    });
  }

}
