import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityUrls, ServiceUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  constructor(private http: HttpClient) {}

  public getAllService(): Observable<any> {
      return this.http.get(ServiceUrls.GETALL);
    }

  public createCommunityService(payload:any): Observable<any> {
    return this.http.post(CommunityUrls.CREATE_COM_SCHED,payload);
  }
}
