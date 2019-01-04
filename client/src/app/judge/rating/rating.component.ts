import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Clause } from 'src/app/clause';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent implements OnInit {

  @Input() clauses: Clause[];
  clausesMap: Map<string, number> = new Map<string, number>();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    if (this.clauses) {
      this.clauses.forEach((clause: Clause) => {
        const formControl = new FormControl(clause.rating || 0, [Validators.required]);
        formControl.valueChanges.subscribe((value: number) => { clause.rating = value; });
        this.form.addControl(clause.title, formControl);
      });
    }
  }

}
