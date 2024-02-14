import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

import { authCodeFlowConfig } from './auth-code-flow.config';
import { useHash } from '../flags';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, private oauthService: OAuthService) {
    // Remember the selected configuration
    if (sessionStorage.getItem('flow') === 'code') {
      this.configureCodeFlow();
    }

    // Automatically load user profile
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => {
        console.debug('state', this.oauthService.state);
        this.oauthService.loadUserProfile();

        const scopes = this.oauthService.getGrantedScopes();
        console.debug('scopes', scopes);
      });
  }

  private configureCodeFlow() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((_) => {
      if (useHash) {
        this.router.navigate(['/']);
      }
    });

    // Optional
    this.oauthService.setupAutomaticSilentRefresh();
  }
}
