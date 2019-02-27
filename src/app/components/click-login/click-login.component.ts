import { Component, HostListener, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Login } from '../login/login.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'click-login',
  templateUrl: './click-login.component.html',
  styleUrls: ['./click-login.component.css']
})
export class ClickLoginComponent {

  @Input() data: Login;

  smallDevice: Observable<BreakpointState>;

  constructor(
    private breakpointObserver: BreakpointObserver) {
        this.smallDevice = breakpointObserver.observe([
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait
        ]);
  }

  @HostListener('click') onclick() {
    this.data.login();
  }

}
