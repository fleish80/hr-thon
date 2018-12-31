import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { trans } from './trans-he';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('he');
    translate.setTranslation('he', trans);
    translate.use('he');
  }
}
