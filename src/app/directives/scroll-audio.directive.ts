import { Directive, Input, HostListener, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Directive({
  selector: '[scrollAudio]'
})
export class ScrollAudioDirective implements OnInit {

  @Input() scrollAudio: string;

  audio: any;

  @HostListener('scroll') onScroll() {
    if (this.audioService.enabled) {
      setTimeout(() => this.audio.play());
    }
  }

  constructor(private audioService: AudioService) {
    
  }

  ngOnInit() {
    this.audio = document.getElementById(this.scrollAudio);
  }

}
