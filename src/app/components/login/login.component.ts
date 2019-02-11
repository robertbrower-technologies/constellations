import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/firestore';
import { AudioService } from '../../services/audio.service';
import { auth } from 'firebase/app';
import { convertRange } from '../../helpers/convert-range';
import { Preferences } from '../preferences/preferences.component';
import { TimeMachineContent } from '../time-machine/time-machine-content';
import { TimeMachineContentActiveEvent } from '../time-machine/time-machine-content-active-event';
import { TimeMachineContentVisibleEvent } from '../time-machine/time-machine-content-visible-event';
import { TimeMachineDeltaEvent } from '../time-machine/time-machine-delta-event';
import { TimeMachineInitContentEvent } from '../time-machine/time-machine-init-content-event';
import { TimeMachineTransformContentEvent } from '../time-machine/time-machine-transform-content-event';
import { User } from '../../models/user';
import { ZodiacCompatibility } from '../../constants/zodiac-compatibility';
import { getZodiacSign } from 'src/app/helpers/get-zodiac-sign';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    data = [
        { id: 1, name: 'Google', imgSrc: 'assets/images/logos/google.svg', login: this.loginGoogle.bind(this) },
        { id: 2, name: 'Facebook', imgSrc: 'assets/images/logos/facebook.svg', login: this.loginFacebook.bind(this) },
        { id: 3, name: 'Twitter', imgSrc: 'assets/images/logos/twitter.svg', login: this.loginTwitter.bind(this) },
        // { id: 4, name: 'Email', imgSrc: 'assets/images/logos/email.svg', login: this.loginEmail.bind(this) }
    ]

    activeIndex: number;

    translateX = 1000;

    translateY = 500;

    translateZ = -1000;

    rotateX = -90;

    maxTranslateZ = -5000;

    boundTrackByFn: Function;

    user$: Subscription;

    returnUrl: string;

    private userDoc: AngularFirestoreDocument<User>;
    
    user: Observable<User>;

    preferences: Preferences;
  
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private audioService: AudioService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.boundTrackByFn = this.trackByFn.bind(this);

        this.preferences = this.route.snapshot.data.preferences;

        this.route.queryParams
            .subscribe(params => this.returnUrl = params['returnUrl'] || '/search');

        this.user$ = this.afAuth.user.subscribe(user => {

            if (user) {
                this.afs.collection('users').doc(user.uid).get()
                    .subscribe((snapshot: DocumentSnapshot<User>) => {
                        if (snapshot.exists) {
                            this.updateUser(user);
                        } else {
                            this.addUser(user);
                        }
                    
                    }, (error: any) => {
                        debugger;
                    }, () => {
                        
                    });
            }

            this.router.navigateByUrl(this.returnUrl);
        })
    }

    ngOnDestroy() {
        if (this.user$) {
            this.user$.unsubscribe();
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

    loginGoogle() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        }
    }
    
    loginFacebook() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
        }
    }

    loginTwitter() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
        }
    }

    loginEmail() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.EmailAuthProvider());
        }
    }

    addUser(user) {
        let now = (new Date()).toISOString();
        this.afs.collection('users').doc(user.uid).set({
            birthday: this.preferences.birthday,
            lastSignInTime: now,
            lastActiveTime: now,
            photoURL: user.photoURL,
            uid: user.uid,
            aquarius_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aquarius'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aquarius'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aquarius'].sex}`,
            pisces_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['pisces'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['pisces'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['pisces'].sex}`,
            aries_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aries'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aries'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aries'].sex}`,
            taurus_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['taurus'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['taurus'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['taurus'].sex}`,
            gemini_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['gemini'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['gemini'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['gemini'].sex}`,
            cancer_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['cancer'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['cancer'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['cancer'].sex}`,
            leo_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['leo'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['leo'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['leo'].sex}`,
            virgo_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['virgo'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['virgo'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['virgo'].sex}`,
            libra_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['libra'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['libra'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['libra'].sex}`,
            scorpio_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['scorpio'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['scorpio'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['scorpio'].sex}`,
            sagittarius_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['sagittarius'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['sagittarius'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['sagittarius'].sex}`,
            capricorn_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['capricorn'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['capricorn'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['capricorn'].sex}`
        });
    }

    updateUser(user) {
        let now = (new Date()).toISOString();
        this.afs.collection('users').doc(user.uid).update({
            birthday: this.preferences.birthday,
            lastSignInTime: now,
            lastActiveTime: now,
            photoURL: user.photoURL,
            aquarius_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aquarius'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aquarius'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aquarius'].sex}`,
            pisces_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['pisces'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['pisces'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['pisces'].sex}`,
            aries_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aries'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aries'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['aries'].sex}`,
            taurus_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['taurus'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['taurus'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['taurus'].sex}`,
            gemini_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['gemini'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['gemini'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['gemini'].sex}`,
            cancer_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['cancer'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['cancer'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['cancer'].sex}`,
            leo_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['leo'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['leo'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['leo'].sex}`,
            virgo_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['virgo'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['virgo'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['virgo'].sex}`,
            libra_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['libra'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['libra'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['libra'].sex}`,
            scorpio_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['scorpio'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['scorpio'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['scorpio'].sex}`,
            sagittarius_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['sagittarius'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['sagittarius'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['sagittarius'].sex}`,
            capricorn_compatibility: `${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['capricorn'].communication}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['capricorn'].compatibility}_${ZodiacCompatibility[getZodiacSign(this.preferences.birthday)]['capricorn'].sex}`
        });
    }

}
