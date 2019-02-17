import { Component, HostListener, Input } from '@angular/core';
import { Login } from '../login/login.component';

@Component({
  selector: 'click-login',
  templateUrl: './click-login.component.html',
  styleUrls: ['./click-login.component.css']
})
export class ClickLoginComponent {

  @Input() data: Login;

  @HostListener('click') onclick() {
    this.data.login();
  }

}
