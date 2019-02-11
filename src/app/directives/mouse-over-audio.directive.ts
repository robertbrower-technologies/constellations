import { Directive, Input, HostListener, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Directive({
  selector: '[mouseOverAudio]'
})
export class MouseOverAudioDirective implements OnInit {

  @Input() mouseOverAudio: string;

  audio: any;

  @HostListener('mouseenter') onMouseEnter() {
    if (this.audioService.enabled) {
      setTimeout(() => this.audio.play());
    }
  }

  constructor(private audioService: AudioService) {
    
  }

  ngOnInit() {
    this.audio = document.getElementById(this.mouseOverAudio);
  }

}
