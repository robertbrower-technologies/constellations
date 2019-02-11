import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EMOTICONS } from '../../services/mat-icon-registry-service';
import { TimeMachineContent } from '../time-machine/time-machine-content';

export interface Chat {

  content: TimeMachineContent;

  emoticon: string;
}

@Component({
  selector: 'emoticons',
  templateUrl: './emoticons.component.html',
  styleUrls: ['./emoticons.component.css']
})
export class EmoticonsComponent implements OnInit {

  emoticons: Array<Array<any>> = new Array<Array<any>>();

  constructor(
    public dialogRef: MatDialogRef<EmoticonsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chat) {}

  ngOnInit() {
    for (let i=0; i<EMOTICONS.length; i+=6) {
      let row = EMOTICONS.slice(i, i + 6)
      this.emoticons.push(row);
    }
  }

  onEmoticonBtnClick(emoticon: string) {
    this.data.emoticon = emoticon;
    this.dialogRef.close(this.data);
  }

  onCancelBtnClick(): void {
    this.dialogRef.close();
  }

}