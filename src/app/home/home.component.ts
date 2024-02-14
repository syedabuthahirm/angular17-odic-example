import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../auth-code-flow.config';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent {
  loginFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private oauthService: OAuthService
  ) {}

  get hasValidAccessToken() {
    return this.oauthService.hasValidAccessToken();
  }

  get hasValidIdToken() {
    return this.oauthService.hasValidIdToken();
  }

  async loginCode() {
    // Tweak config for code flow
    this.oauthService.configure(authCodeFlowConfig);
    await this.oauthService.loadDiscoveryDocument();
    sessionStorage.setItem('flow', 'code');

    this.oauthService.initLoginFlow('/some-state;p1=1;p2=2?p3=3&p4=4');
    // the parameter here is optional. It's passed around and can be used after logging in
  }

  logout() {
    // this.oauthService.logOut();
    this.oauthService.revokeTokenAndLogout();
  }

  get givenName() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['given_name'];
  }

  get familyName() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['family_name'];
  }

  set requestAccessToken(value: boolean) {
    this.oauthService.requestAccessToken = value;
    localStorage.setItem('requestAccessToken', '' + value);
  }

  get requestAccessToken() {
    return this.oauthService.requestAccessToken ??  false;
  }

  get id_token() {
    return this.oauthService.getIdToken();
  }

  get access_token() {
    return this.oauthService.getAccessToken();
  }

  get id_token_expiration() {
    return this.oauthService.getIdTokenExpiration();
  }

  get access_token_expiration() {
    return this.oauthService.getAccessTokenExpiration();
  }
}
