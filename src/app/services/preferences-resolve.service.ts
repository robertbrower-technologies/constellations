import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Preferences } from '../components/preferences/preferences.component';
import { PreferencesService } from './preferences.service';

const DELAY = 0;

@Injectable({
    providedIn: 'root'
})
export class PreferencesResolveService implements Resolve<Observable<Partial<Preferences>>> {

  constructor(private preferencesService: PreferencesService) {}

  resolve() {
    return this.preferencesService.preferences.asObservable().pipe(take(1));
  }
}