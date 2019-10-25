import { Actions, ofType, Effect } from '@ngrx/effects';
import * as authActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(authActions.LOGIN_START), // Filtering for a specific action
    // allows us to create a new observable bz taking another observable!s data
    switchMap((authData: authActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          // dispatch automatically happens here
          return new authActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate
          });
        }),
        catchError(errorRes => {
          let errorMessage = 'An error occured';
          if (!errorRes.error || !errorRes.error.error) {
            return of(new authActions.LoginFail(errorMessage));
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already!';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exist!';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct!';
              break;
          }
          return of(new authActions.LoginFail(errorMessage));
        }),
      );
    }),
  );

  @Effect({dispatch: false}) // This effect doesn't dispatch at the end
  authSuccess = this.actions$.pipe(
    ofType(authActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
