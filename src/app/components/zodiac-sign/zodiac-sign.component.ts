import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'zodiac-sign',
  templateUrl: './zodiac-sign.component.html',
  styleUrls: ['./zodiac-sign.component.css']
})
export class ZodiacSignComponent implements OnInit {

  @Input() zodiacSign: string;

  @Input() width: string;

  @Input() height: string;
    
  // zodiacSigns = {
  //   aquarius: { visible: false },
  //   pisces: { visible: false },
  //   aries: { visible: false },
  //   taurus: { visible: false },
  //   gemini: { visible: false },
  //   cancer: { visible: false },
  //   leo: { visible: false },
  //   virgo: { visible: false },
  //   libra: { visible: false },
  //   scorpio: { visible: false },
  //   sagittarius: { visible: false },
  //   capricorn: {  visible: false }
  // };

  constructor() {
    
  }

  ngOnInit() {
    // this.zodiacSigns[this.zodiacSign].visible = true;
  }

}
