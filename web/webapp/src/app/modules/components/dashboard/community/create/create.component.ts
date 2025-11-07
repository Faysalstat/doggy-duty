import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { MatDialog } from '@angular/material/dialog';
import { DaySelectorComponent } from '../day-selector/day-selector.component';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit {
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  communityId!: number;
  communityCreateForm!: FormGroup;
  serviceList!: CommunityDTO[];
  isEdit: boolean = false;
  startingDate: string = this.datePipe
    .transform(new Date(), 'yyyy-MM-dd')
    ?.toString()!;
  lastServedDate?: any;
  scheduledDate?: any;
  selectedDays: string[] = [];
  isPaused: boolean = false;
  isTaxApplicable: boolean = true;
  isFlatRate: boolean = false;
  frequencies: any[] = [];
  today = new Date();
  day: string = new Date().getDate().toString();
  month: string = (new Date().getMonth() + 1).toString();
  year: string = new Date().getFullYear().toString();
  months: any[] = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  years: string[] = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    this.frequencies = [
      { value: 1, label: 'Every Week' },
      { value: 2, label: 'Every 2 Weeks' },
      { value: 3, label: 'Every 3 Weeks' },
      { value: 4, label: 'Every 4 Weeks' },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.communityId = +params['id'];
      if (this.communityId) {
        this.isEdit = true;
        this.fetchCommunityDetails(this.communityId);
      }
    });
    this.getAllServiceList();
    this.prepareForm(null);
  }

  fetchCommunityDetails(id: number) {
    this.communityService.getCommunityById(id).subscribe({
      next: (res) => {
        let communityDetails = res.body;
        this.isPaused = communityDetails.isPaused;
        this.isFlatRate = communityDetails.isFlatRate || false;
        this.isTaxApplicable = communityDetails.isTaxApplicable;
        if (res.body && res.body.scheduledDaysOfWeek) {
          this.selectedDays = res.body.scheduledDaysOfWeek;
        }
        this.startingDate = res.body.startingDate;
        this.day = this.startingDate ? this.startingDate.split('-')[2] : '';
        this.month = this.startingDate ? this.startingDate.split('-')[1] : '';
        this.year = this.startingDate ? this.startingDate.split('-')[0] : '';
        this.prepareForm(communityDetails);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }

  getAllServiceList() {
    this.communityService.getAllService().subscribe({
      next: (res) => {
        this.serviceList = res.body;
      },
    });
  }

  prepareForm(communityData: any) {
    if (!communityData) {
      communityData = new CommunityDTO();
    }
    this.communityCreateForm = this.formBuilder.group({
      id: [communityData.id],
      communityName: [communityData.communityName, Validators.required],
      communityAddress: [communityData.communityAddress, Validators.required],
      latitude: [communityData.latitude, Validators.required],
      longitude: [communityData.longitude, Validators.required],
      camOfcommunity: [communityData.camOfcommunity, Validators.required],
      gateCode: [communityData.gateCode],
      phone: [communityData.phone, Validators.required],
      email: [communityData.email, Validators.required],
      lockBoxCode: [communityData.lockBoxCode, Validators.required],
      isFlatRate: [communityData.isFlatRate || false],
      serviceName: [communityData.serviceName],
      flatRateAmount: [communityData.flatRateAmount],
      specialRequest: [communityData.specialRequest],
      noOfPetStation: [communityData.noOfPetStation],
      noOfGarbageBin: [communityData.noOfGarbageBin],
      chargePerPetStation: [communityData.chargePerPetStation],
      chargePerGarbageBin: [communityData.chargePerGarbageBin],
      frequency: [communityData.frequency || 1, Validators.required],
      startingDate: [communityData.startingDate],
      scheduledDaysOfWeek: [
        communityData.scheduledDaysOfWeek
          ? communityData.scheduledDaysOfWeek
          : [],
      ],
    });
  }

  goBack() {
    this.router.navigate(['community/list']);
  }
  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter((d) => d !== day); // Unselect
    } else {
      this.selectedDays.push(day); // Select
    }
  }
  onSubmit() {
    if (this.communityCreateForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Form',
      });
      return;
    }
    let payload = this.communityCreateForm.value;
    payload.startingDate = this.startingDate;
    payload.scheduledDaysOfWeek = this.selectedDays;
    payload.isPaused = this.isPaused;
    payload.isTaxApplicable = this.isTaxApplicable;
    payload.isFlatRate = this.isFlatRate;
    
    if (this.isEdit) {
      this.onUpdate(payload);
    } else {
      this.onSave(payload);
    }
  }

  onSave(payload: any) {
    this.communityService.createCommunityService(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Successfully Created',
        });
        this.router.navigate(['community/list']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }

  onUpdate(payload: any) {
    payload.id = this.communityId;
    this.communityService.updateCommunityService(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Successfully Updated',
        });
        this.fetchCommunityDetails(this.communityId);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }

  onDateChange(event: any) {
    if (event.value) {
      this.startingDate = this.datePipe
        .transform(event.value, 'yyyy-MM-dd')
        ?.toString()!;
      console.log('Raw Date From Picker', event.value);
      console.log('Formatted Date:', this.scheduledDate);
    }
  }
  addSchedule() {
    const ref = this.dialog.open(DaySelectorComponent, {
      width: '50%',
    });

    ref.afterClosed().subscribe((selectedDays: any) => {
      console.log('Dialog closed with selected days:', selectedDays);
      if (selectedDays.days && selectedDays.days.length > 0) {
        console.log('Selected Days:', selectedDays.days);
        // Handle the selected days here
      }
    });
  }
  prepareDate(){
    this.startingDate = (this.year ? this.year : '0000') + '-' + (this.month ? this.month : '00') + '-' + (this.day ? ('0' + this.day).slice(-2) : '00');
  }
  onToggleFlatRate(){
    this.communityCreateForm.patchValue({isFlatRate: this.isFlatRate});
    if(this.isFlatRate){
      this.communityCreateForm.get('serviceName')?.setValidators([Validators.required]);
      this.communityCreateForm.get('flatRateAmount')?.setValidators([Validators.required]);
      this.communityCreateForm.get('noOfPetStation')?.clearValidators();
      this.communityCreateForm.get('chargePerPetStation')?.clearValidators();
      this.communityCreateForm.get('noOfGarbageBin')?.clearValidators();
      this.communityCreateForm.get('chargePerGarbageBin')?.clearValidators();
    }else{
      this.communityCreateForm.get('serviceName')?.clearValidators();
      this.communityCreateForm.get('flatRateAmount')?.clearValidators();
      this.communityCreateForm.get('noOfPetStation')?.setValidators([Validators.required]);
      this.communityCreateForm.get('chargePerPetStation')?.setValidators([Validators.required]);
      this.communityCreateForm.get('noOfGarbageBin')?.setValidators([Validators.required]);
      this.communityCreateForm.get('chargePerGarbageBin')?.setValidators([Validators.required]);
    }
  }
}
