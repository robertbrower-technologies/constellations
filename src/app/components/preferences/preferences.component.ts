import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface Preferences {

    birthday: string;  
    
    communication: number;

    compatibility: number;

    sex: number;

}

@Component({
  selector: 'preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {

  birthday: Date;
  
  constructor(
    public dialogRef: MatDialogRef<PreferencesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Preferences) {
    
  }

  onCancelBtnClick(): void {
    this.dialogRef.close();
  }

}
