import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

// import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

// import * as Hammer from 'hammerjs';
// export class MyHammerConfig extends HammerGestureConfig  {
//   overrides = <any>{
//       // override hammerjs default configuration
//       'swipe': { direction: Hammer.DIRECTION_ALL  }
//   }
// }

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { ClickLoginComponent } from './components/click-login/click-login.component';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { EmailLoginComponent } from './components/email-login/email-login.component';
import { EmoticonsComponent } from './components/emoticons/emoticons.component';
import { environment } from '../environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { StarFieldComponent } from './components/star-field/star-field.component';
import { TimeMachineComponent } from './components/time-machine/time-machine.component';
import { TimeMachineContentDirective } from './components/time-machine/time-machine-content.directive';
import { ZodiacSignComponent } from './components/zodiac-sign/zodiac-sign.component';

import { AquariusSvgComponent } from './components/svg/aquarius-svg/aquarius-svg.component';
import { AriesSvgComponent } from './components/svg/aries-svg/aries-svg.component';
import { CancerSvgComponent } from './components/svg/cancer-svg/cancer-svg.component';
import { CapricornSvgComponent } from './components/svg/capricorn-svg/capricorn-svg.component';
import { GeminiSvgComponent } from './components/svg/gemini-svg/gemini-svg.component';
import { LeoSvgComponent } from './components/svg/leo-svg/leo-svg.component';
import { LibraSvgComponent } from './components/svg/libra-svg/libra-svg.component';
import { PiscesSvgComponent } from './components/svg/pisces-svg/pisces-svg.component';
import { SagittariusSvgComponent } from './components/svg/sagittarius-svg/sagittarius-svg.component';
import { ScorpioSvgComponent } from './components/svg/scorpio-svg/scorpio-svg.component';
import { TaurusSvgComponent } from './components/svg/taurus-svg/taurus-svg.component';
import { VirgoSvgComponent } from './components/svg/virgo-svg/virgo-svg.component';

import { ClickAudioDirective } from './directives/click-audio.directive';
import { MouseOverAudioDirective } from './directives/mouse-over-audio.directive';
import { OnInitAudioDirective } from './directives/on-init-audio.directive';
import { ScrollAudioDirective } from './directives/scroll-audio.directive';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ChatComponent,
    CustomSnackbarComponent,
    EmailLoginComponent,
    EmoticonsComponent,
    HeaderComponent,
    SearchComponent,
    LoginComponent,
    PreferencesComponent,
    ClickLoginComponent,
    StarFieldComponent,
    TimeMachineComponent,
    TimeMachineContentDirective,
    AquariusSvgComponent,
    AriesSvgComponent,
    CancerSvgComponent,
    CapricornSvgComponent,
    GeminiSvgComponent,
    LeoSvgComponent,
    LibraSvgComponent,
    PiscesSvgComponent,
    SagittariusSvgComponent,
    ScorpioSvgComponent,
    TaurusSvgComponent,
    VirgoSvgComponent,
    ZodiacSignComponent,
    ClickAudioDirective,
    MouseOverAudioDirective,
    OnInitAudioDirective,
    ScrollAudioDirective
  ],
  entryComponents: [
    CustomSnackbarComponent,
    EmoticonsComponent,
    PreferencesComponent
  ],
  providers: [
    // { 
    //   provide: HAMMER_GESTURE_CONFIG, 
    //   useClass: MyHammerConfig 
    // },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
