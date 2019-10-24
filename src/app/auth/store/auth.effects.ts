import { Actions, ofType, Effect } from '@ngrx/effects';
import * as authActions from './auth.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

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
      ).pipe(catchError(error => {
        // ...
        of();
      }), map(resData => {
        of();
      }));
    }),
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
