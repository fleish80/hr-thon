import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() update = new EventEmitter<Clause[]>();
  ctrlMap: Map<string, FormControl> = new Map<string, FormControl>();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    if (this.clauses) {
      this.clauses.forEach((clause: Clause) => {
        const formControl = new FormControl(clause.rating || 0,
          [Validators.required,
          Validators.min(1),
          Validators.max(10)]);
        formControl.valueChanges.subscribe((value: number) => { clause.rating = value; });
        this.ctrlMap.set(clause.title, formControl);
        this.form.addControl(clause.title, formControl);
      });
    }
  }

  submit() {
    if (this.form.valid) {
      this.update.emit(this.clauses);
    }
  }

}
