import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Judge } from '../models/judge';
import { FirebaseService } from '../services/firebase.service/firebase.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  dataSource: MatTableDataSource<Project>;
  judges$: Observable<Judge[]>;
  displayedColumns: string[] = ['id', 'desc', 'summary'];
  form: FormGroup;
  judgesCtrl: FormControl;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private firebaseService: FirebaseService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.firebaseService.getProjects().subscribe((projects: Project[]) => {
      this.dataSource = new MatTableDataSource(projects);
      this.dataSource.sort = this.sort;
    });
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
