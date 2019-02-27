import { Component, HostListener, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
// import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { ZodiacCompatibility } from '../../constants/zodiac-compatibility';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  @Input() data: any;

  @Input() userZodiacSign: string;

  smallDevice: Observable<BreakpointState>;

  zodiacCompatibility = ZodiacCompatibility;

  communication: number = 0;
  
  compatibility: number = 0;

  sex: number = 0;

  mouseOverOpacity: number = 0;

  inverseMouseOverOpacity: number = 1;

  constructor(
    private breakpointObserver: BreakpointObserver) {
        this.smallDevice = breakpointObserver.observe([
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait
        ]);
  }

  @HostListener('mouseover', ['$event']) onMouseOver(event: any) {
    this.compatibility = this.zodiacCompatibility[this.userZodiacSign][this.data.zodiacSign].compatibility;
    this.communication = this.zodiacCompatibility[this.userZodiacSign][this.data.zodiacSign].communication;
    this.sex = this.zodiacCompatibility[this.userZodiacSign][this.data.zodiacSign].sex;
    this.mouseOverOpacity = 1;
    this.inverseMouseOverOpacity = 0;
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: any) {
    this.compatibility = 0;
    this.communication = 0;
    this.sex = 0;
    this.mouseOverOpacity = 0;
    this.inverseMouseOverOpacity = 1;
  }

}
