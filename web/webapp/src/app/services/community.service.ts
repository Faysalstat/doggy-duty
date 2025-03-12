import { HttpClient, HttpParams } from '@angular/common/http';
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

  public getJobOrderByDate(): Observable<any> {
    let params = new HttpParams();
    // let today = new Date();
    // params = params.append('date', today.);
    return this.http.get(CommunityUrls.GETALL_JOB_ORDER);
  }
}
