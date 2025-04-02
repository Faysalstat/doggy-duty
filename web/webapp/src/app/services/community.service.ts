import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingUrls, CommunityUrls, ConfigUrls, ServiceUrls, TaskUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  fetchInvoiceList:EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) {}
  public getCommunityById(id:number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(CommunityUrls.GET_BY_ID, { params: params });
  }
  public getAllCommunity(): Observable<any> {
    return this.http.get(CommunityUrls.GETALL_BY_DISTANCE_ORDER);
  }
  public getAllCommunityDropdownList(): Observable<any> {
    return this.http.get(CommunityUrls.GETALL);
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
    params = params.append('status',queryParams.get('status'));
    return this.http.get(CommunityUrls.GETALL_JOB_ORDER,{params:params});
  }

  public getBillByCommunity(queryParams: Map<string, any>): Observable<any> {
    let params = new HttpParams();
    params = params.append('communityId',queryParams.get('communityId'));
    params = params.append('status',queryParams.get('status'));
    params = params.append('startDate',queryParams.get('startDate'));
    params = params.append('endDate',queryParams.get('endDate'));
    return this.http.get(BillingUrls.GET_ALL,{params:params});
  }

  public completeTask(payload:any): Observable<any> {
    return this.http.post(TaskUrls.COMPLETE_TASK,payload);
  }

  public getAllConfig(): Observable<any> {
    return this.http.get(ConfigUrls.GET_ALL);
  }

  public updateConfig(payload:any): Observable<any> {
    return this.http.post(ConfigUrls.UPDATE,payload);
  }

  public getAllTask(queryParams: Map<string, any>): Observable<any> {
    let params = new HttpParams();
    params = params.append('status',queryParams.get('status'));
    return this.http.get(TaskUrls.GETALL,{params:params});
  }

  public getAllInvoice(queryParams: Map<string, any>): Observable<any> {
    let params = new HttpParams();
    params = params.append('communityId',queryParams.get('communityId'));
    params = params.append('status',queryParams.get('status'));
    return this.http.get(BillingUrls.GET_ALL_INVOICE,{params:params});
  }

  public getAllConfigByName(queryParams: Map<string, any>): Observable<any> {
    let params = new HttpParams();
    params = params.append('configNames',queryParams.get('configNames'));
    return this.http.get(ConfigUrls.GET_ALL_BY_NAME,{params:params});
  }
  public payInvoice(invoiceId:any): Observable<any> {
    return this.http.post(BillingUrls.PAY_INVOICE,{invoiceId:invoiceId});
  }

  public getSummary():Observable<any>{
    return this.http.get(BillingUrls.GET_SUMMARY);
  }
}
