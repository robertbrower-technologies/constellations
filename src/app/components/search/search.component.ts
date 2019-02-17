import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AudioService } from '../../services/audio.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { convertRange } from '../../helpers/convert-range';
import { getZodiacSign } from '../../helpers/get-zodiac-sign';
import { Preferences } from '../preferences/preferences.component';
import { Subscription } from 'rxjs';
import { TimeMachineContent } from '../time-machine/time-machine-content';
import { TimeMachineContentActiveEvent } from '../time-machine/time-machine-content-active-event';
import { TimeMachineContentVisibleEvent } from '../time-machine/time-machine-content-visible-event';
import { TimeMachineDeltaEvent } from '../time-machine/time-machine-delta-event';
import { TimeMachineInitContentEvent } from '../time-machine/time-machine-init-content-event';
import { TimeMachineTransformContentEvent } from '../time-machine/time-machine-transform-content-event';
import { User } from '../../models/user';
import { ZodiacCompatibility } from '../../constants/zodiac-compatibility';
import { ZodiacDates } from '../../constants/zodiac-dates';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements  OnInit, OnDestroy {

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

    preferences$: Subscription;
    
    preferences: Preferences;

    userZodiacSign: string;

    private usersCollection: AngularFirestoreCollection<User>;

    users$: Subscription;

    constructor(
        private afs: AngularFirestore,
        private audioService: AudioService,
        private preferencesService: PreferencesService,
        private route: ActivatedRoute,
        private router: Router
        ) {
    }

    ngOnInit() {
        this.boundTrackByFn = this.trackByFn.bind(this);
        this.preferences$ = this.preferencesService.preferences.subscribe((preferences: Preferences) => {
            this.preferences = preferences;
            this.userZodiacSign = getZodiacSign(this.preferences.birthday);
            this.usersCollection = this.afs.collection<User>('users', query => 
                query.where(`${this.userZodiacSign}_compatibility`, '>=', `${this.preferences.communication}_${this.preferences.compatibility}_${this.preferences.sex}`));
            if (this.users$) {
                this.users$.unsubscribe();
            }
            this.users$ = this.usersCollection.valueChanges().subscribe(users => {
                this.data = users.map((user) => {
                    return {
                        screenName: user.screenName,
                        zodiacSign: user.zodiacSign,
                        photoURL: user.photoURL
                    }
                });
            });
        });

        this.audioService.playAudio('onInitAudio');
    }

    ngOnDestroy() {
        if (this.users$) {
            this.users$.unsubscribe();
        }

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

    cardClicked(): void {
        this.router.navigate(['/chat']);
    }

}
