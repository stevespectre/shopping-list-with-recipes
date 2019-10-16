import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCsjlQWNlG3ae6Wp--a_7ORauEakkPzkcI',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(err => {
      let errorMessage = 'An error occured';
      if (!err.error || !err.error.error) {
        return throwError(errorMessage);
      }
      switch (err.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already!';
      }
      return throwError(errorMessage);
    }));
  }
}
