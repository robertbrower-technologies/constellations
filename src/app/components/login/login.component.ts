import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { AudioService } from '../../services/audio.service';
import { auth } from 'firebase/app';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { convertRange } from '../../helpers/convert-range';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
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
import { PreferencesService } from 'src/app/services/preferences.service';

export interface Login {
    
    id: number;

    name: string;

    imgSrc: string;

    login: Function;

}

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    data: Array<Login> = [
        { id: 1, name: 'Google', imgSrc: 'assets/images/logos/google.svg', login: this.loginGoogle.bind(this) },
        { id: 2, name: 'Facebook', imgSrc: 'assets/images/logos/facebook.svg', login: this.loginFacebook.bind(this) },
        { id: 3, name: 'Twitter', imgSrc: 'assets/images/logos/twitter.svg', login: this.loginTwitter.bind(this) },
        { id: 4, name: 'Email', imgSrc: 'assets/images/logos/email.svg', login: this.loginEmail.bind(this) }
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

    user: any;

    preferences: Preferences;
  
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private audioService: AudioService,
        private preferencesService: PreferencesService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.boundTrackByFn = this.trackByFn.bind(this);

        this.route.queryParams
            .subscribe(params => this.returnUrl = params['returnUrl'] || '/search');

        this.user$ = this.afAuth.user.subscribe(user => {
            this.user = user;
            if (user) {
                this.afs.collection('users').doc(user.uid).get()
                    .subscribe((snapshot: DocumentSnapshot<User>) => {
                        if (snapshot.exists) {
                            this.preferencesService.load(user.uid);
                            this.updateUser(user);
                        } else {
                            this.addUser(user);
                        }
                    
                    }, (error: Error) => {
                        this.snackBar.openFromComponent(CustomSnackbarComponent, {
                            data: { message: error.message }
                        });
                    }, () => {
                        
                    });

                this.router.navigateByUrl(this.returnUrl);
            }

            
        });

        this.preferencesService.preferences.subscribe((preferences: Preferences) => {
            this.preferences = preferences;
            if (this.user) {
                this.updateUser(this.user);
            }
        });
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
        // setTimeout(() => this.activeIndex = event.content.index);
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
            this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }
    
    loginFacebook() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }

    loginTwitter() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider())
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }

    loginEmail(email: string) {
        if (this.returnUrl) {
            let actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be whitelisted in the Firebase Console.
                url: 'localhost',
                // This must be true.
                handleCodeInApp: true,
                // iOS: {
                //   bundleId: 'com.example.ios'
                // },
                // android: {
                //   packageName: 'com.example.android',
                //   installApp: true,
                //   minimumVersion: '12'
                // },
                dynamicLinkDomain: 'localhost'
              };
              
            this.afAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings).then(() =>
                {
                    localStorage.setItem('email', email);
                })
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }

    addUser(user) {
        let now = (new Date()).toISOString();
        let zodiacSign = getZodiacSign(this.preferences.birthday);
        this.afs.collection('users').doc(user.uid).set({
            uid: user.uid,
            photoURL: user.photoURL,
            lastSignInTime: now,
            lastActiveTime: now,
            screenName: this.preferences.screenName,
            zodiacSign: zodiacSign,
            aquarius_compatibility: `${ZodiacCompatibility[zodiacSign]['aquarius'].communication}_${ZodiacCompatibility[zodiacSign]['aquarius'].compatibility}_${ZodiacCompatibility[zodiacSign]['aquarius'].sex}`,
            pisces_compatibility: `${ZodiacCompatibility[zodiacSign]['pisces'].communication}_${ZodiacCompatibility[zodiacSign]['pisces'].compatibility}_${ZodiacCompatibility[zodiacSign]['pisces'].sex}`,
            aries_compatibility: `${ZodiacCompatibility[zodiacSign]['aries'].communication}_${ZodiacCompatibility[zodiacSign]['aries'].compatibility}_${ZodiacCompatibility[zodiacSign]['aries'].sex}`,
            taurus_compatibility: `${ZodiacCompatibility[zodiacSign]['taurus'].communication}_${ZodiacCompatibility[zodiacSign]['taurus'].compatibility}_${ZodiacCompatibility[zodiacSign]['taurus'].sex}`,
            gemini_compatibility: `${ZodiacCompatibility[zodiacSign]['gemini'].communication}_${ZodiacCompatibility[zodiacSign]['gemini'].compatibility}_${ZodiacCompatibility[zodiacSign]['gemini'].sex}`,
            cancer_compatibility: `${ZodiacCompatibility[zodiacSign]['cancer'].communication}_${ZodiacCompatibility[zodiacSign]['cancer'].compatibility}_${ZodiacCompatibility[zodiacSign]['cancer'].sex}`,
            leo_compatibility: `${ZodiacCompatibility[zodiacSign]['leo'].communication}_${ZodiacCompatibility[zodiacSign]['leo'].compatibility}_${ZodiacCompatibility[zodiacSign]['leo'].sex}`,
            virgo_compatibility: `${ZodiacCompatibility[zodiacSign]['virgo'].communication}_${ZodiacCompatibility[zodiacSign]['virgo'].compatibility}_${ZodiacCompatibility[zodiacSign]['virgo'].sex}`,
            libra_compatibility: `${ZodiacCompatibility[zodiacSign]['libra'].communication}_${ZodiacCompatibility[zodiacSign]['libra'].compatibility}_${ZodiacCompatibility[zodiacSign]['libra'].sex}`,
            scorpio_compatibility: `${ZodiacCompatibility[zodiacSign]['scorpio'].communication}_${ZodiacCompatibility[zodiacSign]['scorpio'].compatibility}_${ZodiacCompatibility[zodiacSign]['scorpio'].sex}`,
            sagittarius_compatibility: `${ZodiacCompatibility[zodiacSign]['sagittarius'].communication}_${ZodiacCompatibility[zodiacSign]['sagittarius'].compatibility}_${ZodiacCompatibility[zodiacSign]['sagittarius'].sex}`,
            capricorn_compatibility: `${ZodiacCompatibility[zodiacSign]['capricorn'].communication}_${ZodiacCompatibility[zodiacSign]['capricorn'].compatibility}_${ZodiacCompatibility[zodiacSign]['capricorn'].sex}`
        });
    }

    updateUser(user) {
        let now = (new Date()).toISOString();
        let zodiacSign = getZodiacSign(this.preferences.birthday);
        this.afs.collection('users').doc(user.uid).update({
            photoURL: user.photoURL,
            lastSignInTime: now,
            lastActiveTime: now,
            screenName: this.preferences.screenName,
            zodiacSign: zodiacSign,
            aquarius_compatibility: `${ZodiacCompatibility[zodiacSign]['aquarius'].communication}_${ZodiacCompatibility[zodiacSign]['aquarius'].compatibility}_${ZodiacCompatibility[zodiacSign]['aquarius'].sex}`,
            pisces_compatibility: `${ZodiacCompatibility[zodiacSign]['pisces'].communication}_${ZodiacCompatibility[zodiacSign]['pisces'].compatibility}_${ZodiacCompatibility[zodiacSign]['pisces'].sex}`,
            aries_compatibility: `${ZodiacCompatibility[zodiacSign]['aries'].communication}_${ZodiacCompatibility[zodiacSign]['aries'].compatibility}_${ZodiacCompatibility[zodiacSign]['aries'].sex}`,
            taurus_compatibility: `${ZodiacCompatibility[zodiacSign]['taurus'].communication}_${ZodiacCompatibility[zodiacSign]['taurus'].compatibility}_${ZodiacCompatibility[zodiacSign]['taurus'].sex}`,
            gemini_compatibility: `${ZodiacCompatibility[zodiacSign]['gemini'].communication}_${ZodiacCompatibility[zodiacSign]['gemini'].compatibility}_${ZodiacCompatibility[zodiacSign]['gemini'].sex}`,
            cancer_compatibility: `${ZodiacCompatibility[zodiacSign]['cancer'].communication}_${ZodiacCompatibility[zodiacSign]['cancer'].compatibility}_${ZodiacCompatibility[zodiacSign]['cancer'].sex}`,
            leo_compatibility: `${ZodiacCompatibility[zodiacSign]['leo'].communication}_${ZodiacCompatibility[zodiacSign]['leo'].compatibility}_${ZodiacCompatibility[zodiacSign]['leo'].sex}`,
            virgo_compatibility: `${ZodiacCompatibility[zodiacSign]['virgo'].communication}_${ZodiacCompatibility[zodiacSign]['virgo'].compatibility}_${ZodiacCompatibility[zodiacSign]['virgo'].sex}`,
            libra_compatibility: `${ZodiacCompatibility[zodiacSign]['libra'].communication}_${ZodiacCompatibility[zodiacSign]['libra'].compatibility}_${ZodiacCompatibility[zodiacSign]['libra'].sex}`,
            scorpio_compatibility: `${ZodiacCompatibility[zodiacSign]['scorpio'].communication}_${ZodiacCompatibility[zodiacSign]['scorpio'].compatibility}_${ZodiacCompatibility[zodiacSign]['scorpio'].sex}`,
            sagittarius_compatibility: `${ZodiacCompatibility[zodiacSign]['sagittarius'].communication}_${ZodiacCompatibility[zodiacSign]['sagittarius'].compatibility}_${ZodiacCompatibility[zodiacSign]['sagittarius'].sex}`,
            capricorn_compatibility: `${ZodiacCompatibility[zodiacSign]['capricorn'].communication}_${ZodiacCompatibility[zodiacSign]['capricorn'].compatibility}_${ZodiacCompatibility[zodiacSign]['capricorn'].sex}`
        });
    }

}
