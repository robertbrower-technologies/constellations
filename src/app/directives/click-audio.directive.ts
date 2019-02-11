import { Directive, Input, HostListener, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Directive({
  selector: '[clickAudio]'
})
export class ClickAudioDirective {

  @Input() clickAudio: string; 
  
  audio: any;
  
  @HostListener('click') onClick() {
    if (this.audioService.enabled) {
      setTimeout(() => this.audio.play());
    }
  }

  constructor(private audioService: AudioService) {
    
  }

  ngOnInit() {
    this.audio = document.getElementById(this.clickAudio);
  }

}
