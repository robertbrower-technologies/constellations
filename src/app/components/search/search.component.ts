import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/firestore';
import { AudioService } from '../../services/audio.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { convertRange } from '../../helpers/convert-range';
import { ChatInvitation } from '../../models/chat-invitation';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { getZodiacSign } from '../../helpers/get-zodiac-sign';
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
import { ZodiacDates } from '../../constants/zodiac-dates';
import { PreferencesService } from 'src/app/services/preferences.service';
import { CLEANUP } from '@angular/core/src/render3/interfaces/view';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements  OnInit, OnDestroy {

    title = 'Constellations';

    data: Array<Partial<User>>;

    activeIndex: number;

    translateX = 250;

    translateY = 500;

    translateZ = -1000;

    rotateX = -90;

    maxTranslateZ = -5000;

    boundTrackByFn: Function;

    zodiacCompatibility = ZodiacCompatibility;

    zodiacDates = ZodiacDates;

    preferences$: Subscription;
    
    preferences: Preferences;

    user$: Subscription;

    user: any;

    userZodiacSign: string;

    private usersCollection: AngularFirestoreCollection<User>;

    users$: Subscription;

    // chatInvitationDoc$: Subscription;

    chatInvitations$: Subscription;

    smallDevice: Observable<BreakpointState>;

    constructor(
        public afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private audioService: AudioService,
        private breakpointObserver: BreakpointObserver,
        private preferencesService: PreferencesService,
        private router: Router,
        private snackBar: MatSnackBar
        ) {
            this.smallDevice = breakpointObserver.observe([
                Breakpoints.HandsetLandscape,
                Breakpoints.HandsetPortrait
            ]);
    }

    ngOnInit() {
        this.boundTrackByFn = this.trackByFn.bind(this);
        this.preferences$ = this.preferencesService.preferences.subscribe((preferences: Preferences) => {
            this.preferences = preferences;
            this.updateUser(this.afAuth.auth.currentUser);
            this.userZodiacSign = getZodiacSign(this.preferences.birthday);
            this.usersCollection = this.afs.collection<User>('users', query => 
                query.where(
                    `${this.userZodiacSign}_compatibility`,'>=',
                    parseInt(`${pad2(this.preferences.communication)}${pad2(this.preferences.compatibility)}${pad2(this.preferences.sex)}`)));
            if (this.users$) {
                this.users$.unsubscribe();
            }
            this.users$ = this.usersCollection.valueChanges().subscribe(users => {
                this.data = users;
            });
        });

        // this.chatInvitationDoc$ = this.afs.collection('chat_invitations').doc(this.afAuth.auth.currentUser.uid).valueChanges()
        //     .subscribe((chatInvitation: ChatInvitation) => {
        //         this.snackBar.openFromComponent(CustomSnackbarComponent, {
        //             data: { message: chatInvitation.from }
        //         });
        //     }, (error: Error) => {
        //         this.snackBar.openFromComponent(CustomSnackbarComponent, {
        //             data: { message: error.message }
        //         });
        //     }, () => {
                
        //     });

        this.chatInvitations$ = this.afs.collection('users').doc(this.afAuth.auth.currentUser.uid).collection('chatInvitations').valueChanges()
            .subscribe(chatInvitations => {
            })

        // this.audioService.playAudio('onInitAudio');
    }

    ngOnDestroy() {
        this.cleanUp();
    }

    onLogout() {
        this.cleanUp();
        this.afAuth.auth.signOut();
        this.router.navigate(['/login']);
    }

    cleanUp() {
        if (this.users$) {
            this.users$.unsubscribe();
        }

        if (this.preferences$) {
            this.preferences$.unsubscribe();
        }

        // if (this.chatInvitationDoc$) {
        //     this.chatInvitationDoc$.unsubscribe();
        // }

        if (this.chatInvitations$) {
            this.chatInvitations$.unsubscribe();
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
        event.content.opacity = event.content.translateZ > 0 ? 1 : convertRange(event.content.translateZ, [this.maxTranslateZ, 0], [0, 1]);
    }

    // Transform the content with a custom sinusoidal behavior.
    transformContent(event: TimeMachineTransformContentEvent) {
        event.content.translateZ += event.delta * this.translateZ;
        event.content.translateX = Math.sin(event.content.translateZ) * this.translateX;
        event.content.translateY = Math.sin(event.content.translateZ) * this.translateY;
        event.content.rotateX = event.content.translateZ > 0 ? this.rotateX : 0;
        event.content.opacity = event.content.translateZ > 0 ? 1 : convertRange(event.content.translateZ, [this.maxTranslateZ, 0], [0, 1]);
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

    cardClicked(content: TimeMachineContent): void {
        // this.router.navigate(['/chat']);
        if (content.active) {
            this.sendChatInvitation(content.data.uid);
        }
    }

    updateUser(user) {
        let now = (new Date()).toISOString();
        let userZodiacSign = getZodiacSign(this.preferences.birthday);
        this.afs.collection('users').doc(user.uid).update({
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

    sendChatInvitation(uid: string) {
        let now = (new Date()).toISOString();
        this.afs.collection('users').doc(uid).collection('chatInvitations').doc(this.afAuth.auth.currentUser.uid).set({
            from: this.afAuth.auth.currentUser.uid,
            sentTime: now
        }).then(() => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
                data: { message: 'Chat invitation sent.' }
            });
        })
        .catch((error) => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
                data: { message: error.message }
            });
        });
    }
    
}
