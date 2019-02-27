import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { AudioService } from '../../services/audio.service';
import { auth } from 'firebase/app';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material';
import { convertRange } from '../../helpers/convert-range';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { Observable, Subscription } from 'rxjs';
import { pad2 } from '../../helpers/pad2';
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

    title = 'Constellations';

    data: Array<Login> = [
        { id: 1, name: 'Google', imgSrc: 'assets/images/logos/google.svg', login: this.signInWithGoogle.bind(this) },
        { id: 2, name: 'Facebook', imgSrc: 'assets/images/logos/facebook.svg', login: this.signInWithFacebook.bind(this) },
        { id: 3, name: 'Twitter', imgSrc: 'assets/images/logos/twitter.svg', login: this.signInWithTwitter.bind(this) },
        { id: 4, name: 'Email', imgSrc: 'assets/images/logos/email.svg', login: this.signInWithEmail.bind(this) }
    ]

    activeIndex: number;

    translateX = 250;

    translateY = 500;

    translateZ = -1000;

    rotateX = -90;

    maxTranslateZ = -5000;

    boundTrackByFn: Function;

    queryParams$: Subscription;
    
    returnUrl: string;

    user$: Subscription;

    user: any;

    preferences$: Subscription;

    preferences: Preferences;

    userDoc$: Subscription;

    smallDevice: Observable<BreakpointState>;
  
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private audioService: AudioService,
        private breakpointObserver: BreakpointObserver,
        private preferencesService: PreferencesService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar) {
            this.smallDevice = breakpointObserver.observe([
                Breakpoints.HandsetLandscape,
                Breakpoints.HandsetPortrait
            ]);
    }

    ngOnInit() {
        this.boundTrackByFn = this.trackByFn.bind(this);

        this.queryParams$ = this.route.queryParams
            .subscribe(params => this.returnUrl = params['returnUrl'] || '/search');

        this.user$ = this.afAuth.user.subscribe(user => {
            this.user = user;
            if (user) {
                if (this.userDoc$) {
                    this.userDoc$.unsubscribe();
                }
                this.userDoc$ = this.afs.collection('users').doc(user.uid).get()
                    .subscribe((snapshot: DocumentSnapshot<User>) => {
                        if (!snapshot.exists) {
                            this.addUser(user);
                        }

                        this.preferencesService.load(user.uid);
                        this.router.navigateByUrl(this.returnUrl);

                    }, (error: Error) => {
                        this.snackBar.openFromComponent(CustomSnackbarComponent, {
                            data: { message: error.message }
                        });
                    }, () => {
                        
                    });
                
            } else {
                this.preferencesService.init();
            }

        });

        this.preferences$ = this.preferencesService.preferences.subscribe((preferences: Preferences) => {
            this.preferences = preferences;
        });

        // this.audioService.playAudio('onInitAudio');
    }

    ngOnDestroy() {
        if (this.preferences$) {
            this.preferences$.unsubscribe();
        }
        
        if (this.userDoc$) {
            this.userDoc$.unsubscribe();
        }

        if (this.user$) {
            this.user$.unsubscribe();
        }

        if (this.queryParams$) {
            this.queryParams$.unsubscribe();
        }

    }

    activateHandsetLayout() {
        
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

    signInWithGoogle() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }
    
    signInWithFacebook() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }

    signInWithTwitter() {
        if (this.returnUrl) {
            this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider())
                .catch((reason: any) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: reason.message }
                    });
                });
        }
    }

    signInWithEmail(email: string) {
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
        let userZodiacSign = getZodiacSign(this.preferences.birthday);
        this.afs.collection('users').doc(user.uid).set({
            uid: user.uid,
            photoURL: user.photoURL,
            lastSignInTime: now,
            lastActiveTime: now,
            screenName: this.preferences.screenName,
            showPhotoInSearchResults: this.preferences.showPhotoInSearchResults,
            zodiacSign: userZodiacSign,
            aquarius_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['aquarius'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['aquarius'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['aquarius'].sex)}`),
            pisces_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['pisces'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['pisces'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['pisces'].sex)}`),
            aries_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['aries'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['aries'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['aries'].sex)}`),
            taurus_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['taurus'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['taurus'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['taurus'].sex)}`),
            gemini_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['gemini'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['gemini'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['gemini'].sex)}`),
            cancer_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['cancer'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['cancer'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['cancer'].sex)}`),
            leo_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['leo'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['leo'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['leo'].sex)}`),
            virgo_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['virgo'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['virgo'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['virgo'].sex)}`),
            libra_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['libra'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['libra'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['libra'].sex)}`),
            scorpio_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['scorpio'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['scorpio'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['scorpio'].sex)}`),
            sagittarius_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['sagittarius'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['sagittarius'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['sagittarius'].sex)}`),
            capricorn_compatibility: parseInt(`${pad2(ZodiacCompatibility[userZodiacSign]['capricorn'].communication)}${pad2(ZodiacCompatibility[userZodiacSign]['capricorn'].compatibility)}${pad2(ZodiacCompatibility[userZodiacSign]['capricorn'].sex)}`)
        });
    }

}
