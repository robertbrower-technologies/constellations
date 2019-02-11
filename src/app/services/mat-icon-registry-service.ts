import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// https://www.flaticon.com/packs/emoticons-4
// <div>Icons made by <a href="https://roundicons.com/" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
export const EMOTICONS = [
    { label: 'angry-1', url: '../assets/images/emoticons/angry-1.svg' },
    { label: 'angry', url: '../assets/images/emoticons/angry.svg' },
    { label: 'bored-1', url: '../assets/images/emoticons/bored-1.svg' },
    { label: 'bored-2', url: '../assets/images/emoticons/bored-2.svg' },
    { label: 'bored', url: '../assets/images/emoticons/bored.svg' },
    { label: 'confused-1', url: '../assets/images/emoticons/confused-1.svg' },
    { label: 'confused', url: '../assets/images/emoticons/confused.svg' },
    { label: 'crying-1', url: '../assets/images/emoticons/crying-1.svg' },
    { label: 'crying', url: '../assets/images/emoticons/crying.svg' },
    { label: 'embarrassed', url: '../assets/images/emoticons/embarrassed.svg' },
    { label: 'emoticons', url: '../assets/images/emoticons/emoticons.svg' },
    { label: 'happy-1', url: '../assets/images/emoticons/happy-1.svg' },
    { label: 'happy-2', url: '../assets/images/emoticons/happy-2.svg' },
    { label: 'happy-3', url: '../assets/images/emoticons/happy-3.svg' },
    { label: 'happy-4', url: '../assets/images/emoticons/happy-4.svg' },
    { label: 'happy', url: '../assets/images/emoticons/happy.svg' },
    { label: 'ill', url: '../assets/images/emoticons/ill.svg' },
    { label: 'in-love', url: '../assets/images/emoticons/in-love.svg' },
    { label: 'kissing', url: '../assets/images/emoticons/kissing.svg' },
    { label: 'mad', url: '../assets/images/emoticons/mad.svg' },
    { label: 'nerd', url: '../assets/images/emoticons/nerd.svg' },
    { label: 'ninja', url: '../assets/images/emoticons/ninja.svg' },
    { label: 'quiet', url: '../assets/images/emoticons/quiet.svg' },
    { label: 'sad', url: '../assets/images/emoticons/sad.svg' },
    { label: 'secret', url: '../assets/images/emoticons/secret.svg' },
    { label: 'smart', url: '../assets/images/emoticons/smart.svg' },
    { label: 'smile', url: '../assets/images/emoticons/smile.svg' },
    { label: 'smiling', url: '../assets/images/emoticons/smiling.svg' },
    { label: 'surprised-1', url: '../assets/images/emoticons/surprised-1.svg' },
    { label: 'surprised', url: '../assets/images/emoticons/surprised.svg' },
    { label: 'suspicious-1', url: '../assets/images/emoticons/suspicious-1.svg' },
    { label: 'suspicious', url: '../assets/images/emoticons/suspicious.svg' },
    { label: 'tongue-out-1', url: '../assets/images/emoticons/tongue-out-1.svg' },
    { label: 'tongue-out', url: '../assets/images/emoticons/tongue-out.svg' },
    { label: 'unhappy', url: '../assets/images/emoticons/unhappy.svg' },
    { label: 'wink', url: '../assets/images/emoticons/wink.svg' }
];

@Injectable({
    providedIn: 'root'
})
export class MatIconRegistryService {

    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        EMOTICONS.forEach(emoticon => this.matIconRegistry.addSvgIcon(emoticon.label, this.domSanitizer.bypassSecurityTrustResourceUrl(emoticon.url)));
    }
  
}