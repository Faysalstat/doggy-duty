import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityUrls, ServiceUrls, TaskUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  constructor(private http: HttpClient) {}
  public getCommunityById(id:number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(CommunityUrls.GET_BY_ID, { params: params });
  }
  public getAllCommunity(): Observable<any> {
    return this.http.get(CommunityUrls.GETALL_BY_DISTANCE_ORDER);
  }
  public getAllService(): Observable<any> {
      return this.http.get(ServiceUrls.GETALL);
    }

  public createCommunityService(payload:any): Observable<any> {
    return this.http.post(CommunityUrls.CREATE_COM_SCHED,payload);
  }
  public updateCommunityService(payload:any): Observable<any> {
    return this.http.post(CommunityUrls.UPDATE_COM_SCHED,payload);
  }
  public getJobOrderByDate(queryParams: Map<string, any>): Observable<any> {
    let params = new HttpParams();
    params = params.append('date',queryParams.get('date'));
    params = params.append('status',queryParams.get('status'));
    return this.http.get(CommunityUrls.GETALL_JOB_ORDER,{params:params});
  }

  public completeTask(payload:any): Observable<any> {
    return this.http.post(TaskUrls.COMPLETE_TASK,payload);
  }
}
