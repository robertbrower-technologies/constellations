import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    enabled: boolean = true;    

    playAudio(id: string) {
        if (this.enabled) {
            let audio = document.getElementById(id) as HTMLAudioElement;
            setTimeout(() => audio.play());
        }
    }
  
}