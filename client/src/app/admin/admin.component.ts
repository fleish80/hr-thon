import { Component, OnInit, HostBinding } from '@angular/core';
import { FirebaseService } from '../services/firebase.service/firebase.service';
import { Observable } from 'rxjs';
import { Judge } from '../models/judge';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  projects$: Observable<Project[]>;
  judges$: Observable<Judge[]>;
  displayedColumns: string[] = ['id', 'desc', 'summary'];
  form: FormGroup;
  judgesCtrl: FormControl;

  constructor(private firebaseService: FirebaseService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.projects$ = this.firebaseService.getProjects();
    this.judges$ = this.firebaseService.getJudges();
    this.judgesCtrl = new FormControl(null, [Validators.required]);
    this.form = this.fb.group({
      judgesCtrl: this.judgesCtrl
    });
  }

  submit() {
    if (this.form.valid) {
      const uid = this.judgesCtrl.value;
      this.router.navigate(['judge', uid]);
    }
  }

}
