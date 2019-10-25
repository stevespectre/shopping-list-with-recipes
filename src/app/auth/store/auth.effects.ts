import { Actions, ofType, Effect } from '@ngrx/effects';
import * as authActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuth = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  // dispatch automatically happens here
  return new authActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An error occured';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new authActions.AuthenticateFail(errorMessage));
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
  return of(new authActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(authActions.SIGNUP_START),
    switchMap((signupAction: authActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuth(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        }),
      );
    })
  );

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
          return handleAuth(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        }),
      );
    }),
  );

  @Effect({dispatch: false}) // This effect doesn't dispatch at the end
  authRedirect = this.actions$.pipe(
    ofType(authActions.AUTHENTICATE_SUCCESS, authActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(authActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        token: string;
        tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'DUMMY'};
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData.token,
        new Date(userData.tokenExpirationDate)
      );

      if (loadedUser.userToken) {
        // this.user.next(loadedUser);
        return new authActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.userToken,
          expirationDate: new Date(userData.tokenExpirationDate)
        });
        // const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
        // this.autoLogout(expirationDuration);
      }
      return {type: 'DUMMY'};
    })
  );

  @Effect({dispatch: false}) // This effect doesn't dispatch at the end
  authLogout = this.actions$.pipe(
    ofType(authActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData');
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
