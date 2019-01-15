import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service/firebase.service';
import { Observable } from 'rxjs';
import { Judge } from '../models/judge';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  dataSource$: Observable<MatTableDataSource<Project>>;
  judges$: Observable<Judge[]>;
  displayedColumns: string[] = ['id', 'desc', 'summary'];
  form: FormGroup;
  judgesCtrl: FormControl;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private firebaseService: FirebaseService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.dataSource$ = this.firebaseService.getProjects().pipe(
      map((projects: Project[]) => {
        const dataSource = new MatTableDataSource(projects);
        dataSource.sort = this.sort;
        return dataSource;
      })
    );
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
