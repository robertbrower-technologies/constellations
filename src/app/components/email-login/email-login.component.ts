import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Login } from '../login/login.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {

    @Input() data: Login;

    formGroup: FormGroup;

    smallDevice: Observable<BreakpointState>;

    constructor(
      private breakpointObserver: BreakpointObserver) {
          this.smallDevice = breakpointObserver.observe([
              Breakpoints.HandsetLandscape,
              Breakpoints.HandsetPortrait
          ]);
    }

    loginBtnClicked() {

    }

    ngOnInit() {
      this.formGroup = this.createFormGroup();
    }

    createFormGroup(): FormGroup {
      let email = localStorage.getItem('email');
      let group: any = {
        email: new FormControl(email ? email : '', [Validators.required, Validators.email])
      };
  
      return new FormGroup(group);
    }

    getErrorMessage() {
      return this.formGroup.get('email').hasError('required') ? 'You must enter your Email' :
          this.formGroup.get('email').hasError('email') ? 'Not a valid email' :
              '';
    }

}
