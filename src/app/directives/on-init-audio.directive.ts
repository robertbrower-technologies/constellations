import { Directive, Input, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Directive({
  selector: '[onInitAudio]'
})
export class OnInitAudioDirective {

  @Input() onInitAudio: string; 
  
  audio: any;
  
  constructor(private audioService: AudioService) {
  }

  ngOnInit() {
    this.audio = document.getElementById(this.onInitAudio);
    setTimeout(() => this.audio.play());
  }

}
