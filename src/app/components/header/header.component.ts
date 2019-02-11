import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { PreferencesService } from '../../services/preferences.service';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() title: string;

  @Input() zodiacSign: string;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private preferencesService: PreferencesService) {}

  logoutBtnClicked() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  preferencesBtnClicked(): void {
    this.preferencesService.openPreferencesDialog();
  }

}
