import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { PreferencesComponent } from '../preferences/preferences.component';
import { PreferencesService } from '../../services/preferences.service';
import { getZodiacSign } from '../../helpers/get-zodiac-sign';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() title: string;

  getZodiacSign = getZodiacSign

  constructor(
    public afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    public preferencesService: PreferencesService) {}

  logoutBtnClicked() {
    this.afAuth.auth.signOut();
    this.preferencesService.init();
    this.router.navigate(['/login']);
  }

  preferencesBtnClicked(): void {
    this.openPreferencesDialog(this.afAuth.auth.currentUser.uid);
  }

  public openPreferencesDialog(uid: string): void {
    const dialogRef = this.dialog.open(PreferencesComponent, {
        // width: '320px',
        data: {
            birthday: new Date(this.preferencesService.getBirthday(uid)),
            communication: this.preferencesService.getComunication(uid),
            compatibility: this.preferencesService.getCompatibility(uid),
            screenName: this.preferencesService.getScreenName(uid),
            sex: this.preferencesService.getSex(uid)
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.setItem(`${uid} birthday`, result.birthday.toISOString());
        localStorage.setItem(`${uid} communication`, result.communication);
        localStorage.setItem(`${uid} compatibility`, result.compatibility);
        localStorage.setItem(`${uid} screenName`, result.screenName);
        localStorage.setItem(`${uid} sex`, result.sex);
        this.preferencesService.preferences.next({
            birthday: result.birthday.toISOString(),
            communication: result.communication,
            compatibility: result.compatibility,
            screenName: result.screenName,
            sex: result.sex
        });
      }
    });
}

}
