import { Component, Input } from '@angular/core';

@Component({
  selector: 'zodiac-sign',
  templateUrl: './zodiac-sign.component.html',
  styleUrls: ['./zodiac-sign.component.css']
})
export class ZodiacSignComponent {

  @Input() zodiacSign: string;

  @Input() width: string;

  @Input() height: string;

}
