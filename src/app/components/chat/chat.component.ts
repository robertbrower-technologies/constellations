import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AudioService } from '../../services/audio.service';
import { convertRange } from '../../helpers/convert-range';
import { EmoticonsComponent } from '../emoticons/emoticons.component';
import { getZodiacSign } from '../../helpers/get-zodiac-sign';
import { Preferences } from '../preferences/preferences.component';
import { PreferencesService } from '../../services/preferences.service';
import { TimeMachineContent } from '../time-machine/time-machine-content';
import { TimeMachineContentActiveEvent } from '../time-machine/time-machine-content-active-event';
import { TimeMachineContentVisibleEvent } from '../time-machine/time-machine-content-visible-event';
import { TimeMachineInitContentEvent } from '../time-machine/time-machine-init-content-event';
import { TimeMachineDeltaEvent } from '../time-machine/time-machine-delta-event';
import { TimeMachineTransformContentEvent } from '../time-machine/time-machine-transform-content-event';
import { ZodiacCompatibility } from '../../constants/zodiac-compatibility';
import { ZodiacDates } from '../../constants/zodiac-dates';
import { ZodiacSignNames } from '../../constants/zodiac-sign-names';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements  OnInit, OnDestroy {

    data: Array<any>;

    activeIndex: number;

    translateX = 1000;

    translateY = 500;

    translateZ = -1000;

    rotateX = -90;

    maxTranslateZ = -5000;

    boundTrackByFn: Function;

    zodiacCompatibility = ZodiacCompatibility;

    zodiacDates = ZodiacDates;

    preferences: Preferences;

    preferences$: Subscription;

    userZodiacSign: string;

    constructor(
        public afAuth: AngularFireAuth,
        private audioService: AudioService,
        private dialog: MatDialog,
        private preferencesService: PreferencesService,
        private router: Router) {
    }

    ngOnInit() {
        this.boundTrackByFn = this.trackByFn.bind(this);
        this.preferences$ = this.preferencesService.preferences
            .subscribe(preferences => {
                this.preferences = preferences;
                this.userZodiacSign = getZodiacSign(preferences.birthday);
                this.data = ZodiacSignNames
                    .filter((zodiacSign: string, index: number) => {
                        let communication = this.zodiacCompatibility[this.userZodiacSign][zodiacSign].communication >= this.preferences.communication;
                        let compatibility = this.zodiacCompatibility[this.userZodiacSign][zodiacSign].compatibility >= this.preferences.compatibility;
                        let sex = this.zodiacCompatibility[this.userZodiacSign][zodiacSign].sex >= this.preferences.sex;
                        return compatibility && communication && sex;
                    }).map((zodiacSign: string, index: number) => {
                        return  { id: index, zodiacSign: zodiacSign };
                    });
            });

        this.audioService.playAudio('onInitAudio');
    }

    ngOnDestroy() {
        if (this.preferences$) {
            this.preferences$.unsubscribe();
        }
    }

    // Track by the data id.
    trackByFn(index: number, content: TimeMachineContent) {
        return content.data.id;
    }

    // Initialize the content with a custom sinusoidal behavior.
    initContent(event: TimeMachineInitContentEvent) {
        event.content.translateZ = event.index * this.translateZ;
        event.content.translateX = Math.sin(event.content.translateZ) * this.translateX;
        event.content.translateY = Math.sin(event.content.translateZ) * this.translateY;
        event.content.rotateX = 0;
        event.content.opacity = convertRange(event.content.translateZ, [this.maxTranslateZ, 0], [0, 1]);
    }

    // Transform the content with a custom sinusoidal behavior.
    transformContent(event: TimeMachineTransformContentEvent) {
        event.content.translateZ += event.delta * this.translateZ;
        event.content.translateX = Math.sin(event.content.translateZ) * this.translateX;
        event.content.translateY = Math.sin(event.content.translateZ) * this.translateY;
        event.content.rotateX = event.content.translateZ > 0 ? this.rotateX : 0;
        event.content.opacity = convertRange(event.content.translateZ, [this.maxTranslateZ, 0], [0, 1]);
    }
    
    // Capture the active index for the slider.
    contentActive(event: TimeMachineContentActiveEvent) {
        if (event.content.active) {
        // Use setTimeout() to avoid ExpressionChangedAfterItHasBeenCheckedError with slider
        setTimeout(() => this.activeIndex = event.content.index);
        }
    }

    // Defer setting the img src attribute until the content is visible.
    contentVisible(event: TimeMachineContentVisibleEvent) {
        if (event.content.visible && event.content.data.imgSrc === '') {
        event.content.data.imgSrc = `${event.content.data.visibleImgSrc + '?ts=' + (new Date()).getTime()}`;
        }
    }

    delta(event: TimeMachineDeltaEvent) {
        this.audioService.playAudio('scrollAudio');
    }

    insertEmoticonBtnClicked(content: any) {
        const dialogRef = this.dialog.open(EmoticonsComponent, {
            // width: '320px',
            data: { content: content, emoticon: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            let img = new Image(18, 18);
            img.src = result.emoticon.url;
            result.content.appendChild(img);
            
        });
    }

}
