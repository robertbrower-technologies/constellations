import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getZodiacSign } from '../../helpers/get-zodiac-sign';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Preferences } from '../preferences/preferences.component';
import { PreferencesService } from '../../services/preferences.service';
import { AngularFireAuth } from '@angular/fire/auth';

export interface Preferences {

  birthday: string;

  communication: number;

  compatibility: number;

  screenName: string;

  showPhotoInSearchResults: boolean;

  sex: number;

}

@Component({
  selector: 'preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  formGroup: FormGroup;

  getZodiacSign = getZodiacSign;
  
  constructor(
    public afAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: Preferences,
    public dialogRef: MatDialogRef<PreferencesComponent>,
    public preferencesService: PreferencesService) {
  }

  ngOnInit() {
    this.formGroup = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    let group: any = {
      birthday: new FormControl(new Date(this.data.birthday)),
      communication: new FormControl(this.data.communication),
      compatibility: new FormControl(this.data.compatibility),
      screenName: new FormControl(this.data.screenName),
      showPhotoInSearchResults: new FormControl(this.data.showPhotoInSearchResults),
      sex: new FormControl(this.data.sex)
    };

    return new FormGroup(group);
  }

  onSaveBtnClick(): void {
    this.dialogRef.close({
      birthday: this.formGroup.get('birthday').value,
      communication: this.formGroup.get('communication').value,
      compatibility: this.formGroup.get('compatibility').value,
      screenName: this.formGroup.get('screenName').value,
      showPhotoInSearchResults: this.formGroup.get('showPhotoInSearchResults').value,
      sex: this.formGroup.get('sex').value
    });
  }

  onCancelBtnClick(): void {
    this.dialogRef.close();
  }

}
