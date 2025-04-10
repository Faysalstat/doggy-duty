import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventScheduleUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root'
})
export class EventScheduleService {

  constructor(private http: HttpClient) {}
  public createEventSchedule(payload:any): Observable<any> {
    return this.http.post(EventScheduleUrls.CREATE, payload);
  }
  public updateEventSchedule(payload:any): Observable<any> {
    return this.http.post(EventScheduleUrls.UPDATE, payload);
  }
  public getEventScheduleById(id:number): Observable<any> {
    return this.http.get(EventScheduleUrls.GET_BY_ID + id);
  }
  public getAllEventSchedule(): Observable<any> {
    return this.http.get(EventScheduleUrls.GET_ALL);
  }
  public deleteEventSchedule(id:number): Observable<any> {
        let params = new HttpParams();
        params = params.append('id', id);
    return this.http.delete(EventScheduleUrls.DELETE, { params: params });
  }
}
