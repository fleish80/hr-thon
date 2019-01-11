import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs';
import { Judge } from '../judge';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private firebaseService: FirebaseService, private fb: FormBuilder, private router: Router) { }

  projects$: Observable<Project[]>;
  judges$: Observable<Judge[]>;
  displayedColumns: string[] = ['desc', 'summary'];
  dataSource = ELEMENT_DATA;
  form: FormGroup;
  judgesCtrl: FormControl;


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
