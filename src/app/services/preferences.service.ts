import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PreferencesComponent } from '../components/preferences/preferences.component';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '../components/preferences/preferences.component';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

    preferences = new BehaviorSubject<Preferences>({
        birthday: this.getBirthday(),
        communication: this.getComunication(),
        compatibility: this.getCompatibility(),
        sex: this.getSex()
    });

    constructor(
        private dialog: MatDialog) {
    }

    public openPreferencesDialog(): void {
        const dialogRef = this.dialog.open(PreferencesComponent, {
            // width: '320px',
            data: {
                birthday: new FormControl(new Date(this.getBirthday())),
                compatibility: new FormControl(this.getCompatibility()),
                communication: new FormControl(this.getComunication()),
                sex: new FormControl(this.getSex())
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            let birthday = result.birthday.value.toISOString();
            localStorage.setItem('birthday', birthday);
            localStorage.setItem('compatibility', result.compatibility.value);
            localStorage.setItem('communication', result.communication.value);
            localStorage.setItem('sex', result.sex.value);
            this.preferences.next({
                birthday: this.getBirthday(),
                compatibility: this.getCompatibility(),
                communication: this.getComunication(),
                sex: this.getSex()
            })
        });
    }

    private getBirthday() {
        let _birthday = localStorage.getItem('birthday');
        let birthday = _birthday ? _birthday : (new Date()).toISOString();
        return birthday;
    }

    private getComunication() {
        let _communication = localStorage.getItem('communication');
        let communication = _communication ? parseInt(_communication) : 75;
        return communication;
    }

    private getCompatibility() {
        let _compatibility = localStorage.getItem('compatibility');
        let compatibility = _compatibility ? parseInt(_compatibility) : 75;
        return compatibility;
    }

    private getSex() {
        let _sex = localStorage.getItem('sex');
        let sex = _sex ? parseInt(_sex) : 75;
        return sex;
    }
  
}