import { Component, Inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
import { MAT_SNACK_BAR_DATA } from '@angular/material';


export interface CustomSnackbarData {
    
    message: string;

}

@Component({
  selector: 'custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.css']
})
export class CustomSnackbarComponent {

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: CustomSnackbarData,
        private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>) {}

    onClick() {
        this.snackBarRef.dismiss();
    }

}