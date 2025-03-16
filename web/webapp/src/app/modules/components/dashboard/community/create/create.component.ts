import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CommunityDTO } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  communityId!: number;
  communityCreateForm!: FormGroup;
  serviceList!: CommunityDTO[];
  isEdit: boolean = false;
  startingDate?: any;
  lastServedDate?: any;
  scheduledDate?: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService
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
        this.startingDate = this.convertUTCtoLocal(
          communityDetails.startingDate
        );
        this.lastServedDate = this.convertUTCtoLocal(
          communityDetails.lastServedDate
        );
        this.scheduledDate = this.convertUTCtoLocal(
          communityDetails.scheduledDate
        );
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

  // private populateForm(communityData: any): void {
  //   this.communityCreateForm.patchValue({
  //     id: communityData.id,
  //     communityName: communityData.communityName,
  //     communityAddress: communityData.communityAddress,
  //     latitude: communityData.latitude,
  //     longitude: communityData.longitude,
  //     camOfcommunity: communityData.camOfcommunity,
  //     gateCode: communityData.gateCode,
  //     phone: communityData.phone,
  //     email: communityData.email,
  //     lockBoxCode: communityData.lockBoxCode,
  //     specialRequest: communityData.specialRequest,
  //     noOfPetStation: communityData.noOfPetStation,
  //     noOfGarbageBin: communityData.noOfGarbageBin,
  //     chargePerPetStation: communityData.chargePerPetStation,
  //     chargePerGarbageBin: communityData.chargePerGarbageBin,
  //     frequency: communityData.frequency,
  //   });
  // }

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
    });
  }

  goBack() {
    this.router.navigate(['community/list']);
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
    // Convert local datepicker values to UTC before sending
    payload.startingDate = this.convertLocalToUTC(this.startingDate);
    payload.lastServedDate = this.convertLocalToUTC(this.lastServedDate);
    payload.scheduledDate = this.convertLocalToUTC(this.scheduledDate);
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

  convertUTCtoLocal(date: string | null): Date | null {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!date) return null;
    // Converts UTC date to local date
    return moment.utc(date).local().startOf('day').toDate(); // Ensure it's set to midnight in local timezone
  }

  convertLocalToUTC(date: Date | null): string | null {
    if (!date) return null;
    // Set time to midnight UTC
    return moment(date).utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
  }
}
