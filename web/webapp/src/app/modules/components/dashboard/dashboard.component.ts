import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { AppConfigNames, TaskStatus } from '../../dto/models';
import { PdfMakeService } from 'src/app/services/pdf-make.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  communityList: any[] = [];
  chargePerBagRoll: number = 0;
  chargePerBinReplacement: number = 0;
  chargePerNewStationInstallment: number = 0;
  chargePerHandSanitizer: number = 0;
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService,
    private pdfMakeService: PdfMakeService
  ) {}

  ngOnInit() {
    this.fetchPriceConfigs();
    this.fetchJobOrder();
  }
  fetchPriceConfigs(){
    const params: Map<string, any> = new Map();
    params.set('configNames', AppConfigNames.PRICE_PER_BAG_ROLL + ',' + AppConfigNames.PRICE_PER_BIN_REPLACEMENT+','+AppConfigNames.PRICE_PER_NEW_STATION_INSTALLMENT);
    this.communityService.getAllConfigByName(params).subscribe({
      next: (res) => {
        console.log(res);
        this.chargePerBagRoll = res.body.find((config: any) => config.configName === AppConfigNames.PRICE_PER_BAG_ROLL).value;
        this.chargePerBinReplacement = res.body.find((config: any) => config.configName === AppConfigNames.PRICE_PER_BIN_REPLACEMENT).value;
        this.chargePerNewStationInstallment = res.body.find((config: any) => config.configName === AppConfigNames.PRICE_PER_NEW_STATION_INSTALLMENT).value;
        this.chargePerHandSanitizer = res.body.find((config: any) => config.configName === AppConfigNames.PRICE_PER_HAND_SANITIZER).value;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.measse,
        });
      },
    });
  }
  fetchJobOrder() {
    const params: Map<string, any> = new Map();
    params.set('date', '');
    params.set('status', TaskStatus.PENDING);
    this.communityService.getJobOrderByDate(params).subscribe({
      next: (res) => {
        this.communityList = res.body;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.measse,
        });
      },
    });
  }

  ngOnDestroy() {}
  getFormattedDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return today.toLocaleDateString('en-GB', options);
  }

  downloadWorkOrder() {
    let orders: any[] = [];
    let index = 1;
    // head: [['SN', 'Comunity Name', 'Address', 'Manager','Contact No', 'Garbage Bins QNT', 'Pet Station QNT']],
    this.communityList.forEach((community: any) => {
      let orderRow = [];
      orderRow.push(index);
      orderRow.push(community.communityName);
      orderRow.push(community.communityAddress);
      orderRow.push(community.camOfcommunity);
      orderRow.push(community.phone);
      orderRow.push(community.noOfGarbageBin);
      orderRow.push(community.noOfPetStation);
      index++;
      orders.push(orderRow);
    });
    let workOrderModel = {
      date: '',
      invoiceId: 'N/A',
      orders: orders,
    };
    let today = new Date();
    let formatedDate =
      today.getDate() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getFullYear();
    this.pdfMakeService.downloadWorkOrder(workOrderModel, formatedDate);
  }
}
