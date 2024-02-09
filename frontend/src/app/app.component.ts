import { Component } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt, 'it');

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent{

    public user?: User | null;
    public role?: string;

    constructor(private accountService: AccountService, private router: Router) {
      this.accountService.user.subscribe(x => this.user = x)
      this.role = this.accountService.userValue?.role

      this.accountService.check()
        .subscribe(x => {

          //users table database is empty, so redirect to register
          if(!x) {
            this.router?.navigate(['/register'])
          }
        });
    }

    logout() {
      this.accountService.logout();
    }
}
