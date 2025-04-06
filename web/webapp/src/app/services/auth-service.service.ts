import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  public signIn(queryParams: Map<string, any>): Observable<any> {
    return this.http.post(AuthenticationUrls.LOGIN, queryParams.get('user'));
  }
  public signOut(queryParams: Map<string, any>): Observable<any> {
    return this.http.post(AuthenticationUrls.SIGN_OUT, queryParams.get('user'));
  }
  public addUser(queryParams: Map<string, any>): Observable<any> {
    return this.http.post(AuthenticationUrls.ADD_USER, queryParams.get('user'));
  }
  public checkExistingUser(userName: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('userName', userName);
    return this.http.get(AuthenticationUrls.CHECK_EXISTING_USER, { params: params });
  }
  public getAllUser(username: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get(AuthenticationUrls.GET_ALL_USER, { params: params });
  }
  public isLoggedIn(token:any):Promise<any>{
    let params = new HttpParams();
    params = params.append("token",token);
    return this.http.get(AuthenticationUrls.CHECK_IS_LOGGEDIN,{params:params}).toPromise();
  }
  public sendResetToken(email:string): Observable<any> {
    let params = new HttpParams();
    params = params.append("email",email);
    return this.http.get(AuthenticationUrls.SEND_RESET_TOKEN,{params:params});
  }

  public verifyResetToken(token:string):Observable<any>{
    let params = new HttpParams();
    params = params.append("token",token);
    return this.http.get(AuthenticationUrls.VERIFY_RESET_TOKEN,{params:params});
  }

  public resetPassword(paylaod:any ):Observable<any>{
    return this.http.post(AuthenticationUrls.RESET_PASSWORD,paylaod);
  }
}
