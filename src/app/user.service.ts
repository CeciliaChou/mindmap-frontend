import {Injectable} from '@angular/core';
import {MeGQL} from "../generated/graphql";
import {AuthService} from "ng2-ui-auth";
import {BehaviorSubject, of, Subject} from "rxjs";
import {catchError} from "rxjs/operators";

type User = {
  id?: string,
  login?: string,
  avatarUrl?: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: User;

  token: string;

  currentUserLoaded$ = new Subject<void>();

  constructor(
    private meGQL: MeGQL,
    private auth: AuthService,
  ) {
  }

  getToken() {
    this.auth.authenticate('github')
      .subscribe(({token: {access_token}}) => {
        this.token = access_token;
        console.log('got token');
        this.getCurrentUser();
      })
  }

  getCurrentUser() {
    this.currentUserLoaded$.next();
    console.log('fetching me');
    this.meGQL.fetch()
      .subscribe(({data: {me}}) => {
        console.log('me is', me);
        this.currentUser = me;
      })
  }
}
