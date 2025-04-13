import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MatDialog } from '@angular/material/dialog';
import { DaySelectorComponent } from '../day-selector/day-selector.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit {
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  communityId!: number;
  communityCreateForm!: FormGroup;
  serviceList!: CommunityDTO[];
  isEdit: boolean = false;
  startingDate: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')?.toString()!;
  lastServedDate?: any;
  scheduledDate?: any;
  selectedDays: string[] = [];
  isPaused: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {}

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
        console.log(res);
        let communityDetails = res.body;
        this.isPaused = communityDetails.isPaused;
        if(res.body && res.body.scheduledDaysOfWeek){
          this.selectedDays = res.body.scheduledDaysOfWeek.split(',');
        }
        this.startingDate = this.datePipe.transform(res.body.startingDate, 'yyyy-MM-dd')?.toString()!;
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
      specialRequest: [communityData.specialRequest, Validators.required],
      noOfPetStation: [communityData.noOfPetStation],
      noOfGarbageBin: [communityData.noOfGarbageBin],
      chargePerPetStation: [communityData.chargePerPetStation],
      chargePerGarbageBin: [communityData.chargePerGarbageBin],
      frequency: [communityData.frequency],
      startingDate: [communityData.startingDate],
      scheduledDaysOfWeek: [communityData.scheduledDaysOfWeek?communityData.scheduledDaysOfWeek.split(','):[]],
    });
  }

  goBack() {
    this.router.navigate(['community/list']);
  }
  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day); // Unselect
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
    payload.scheduledDaysOfWeek = this.selectedDays.join(',');
    payload.isPaused = this.isPaused;
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
        this.prepareForm(null);
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

  onDateChange(event:any) {
    if (event.value) {
      this.startingDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')?.toString()!;
      console.log("Raw Date From Picker", event.value);
      console.log("Formatted Date:", this.scheduledDate);
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
}
