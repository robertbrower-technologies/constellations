import { Component, OnInit } from '@angular/core';
import * as StarField from './star-field.js';

@Component({
  selector: 'star-field',
  templateUrl: './star-field.component.html',
  styleUrls: ['./star-field.component.css']
})
export class StarFieldComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var starField = new StarField.StarField('star-field').render(500, 10);
  }

}
