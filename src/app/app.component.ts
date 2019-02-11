import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { getZodiacSign } from './helpers/get-zodiac-sign';
import { MatIconRegistryService } from '../app/services/mat-icon-registry-service';
import { PreferencesService } from './services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'Constellations';

  userZodiacSign: string;

  preferences$: Subscription;

  constructor(
    private matIconRegistryService: MatIconRegistryService, // Appears to be unused but it registers SVG icons
    private preferencesService: PreferencesService) {}

  ngOnInit() {
    this.preferences$ = this.preferencesService.preferences
      .subscribe(preferences => this.userZodiacSign = getZodiacSign(preferences.birthday));
  }

  ngOnDestroy() {
    if (this.preferences$) {
      this.preferences$.unsubscribe();
    }
  }

}
