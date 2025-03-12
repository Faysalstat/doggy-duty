import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  communityCreateForm!: FormGroup;
  serviceList!: any[];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private communityService: CommunityService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getAllServiceList();
    this.prepareForm();
  }
  getAllServiceList() {
    this.communityService.getAllService().subscribe({
      next: (res) => {
        this.serviceList = res.body;
      },
    });
  }
  prepareForm() {
    this.communityCreateForm = this.formBuilder.group({
      communityName: ['', Validators.required],
      communityAddress: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      camOfcommunity: ['', Validators.required],
      gateCode: [''],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      lockBoxCode: ['', Validators.required],
      specialRequest: ['', Validators.required],
      noOfPetStation: [null],
      noOfGarbageBin: [null],
      frequency:[null],
      startingDate:[null],
      lastServedDate:[null],
      selectedServices: [[]],
    });
  }
  goBack() {
    this.router.navigate(['community/list']);
  }
  onSave() {
    if(this.communityCreateForm.invalid){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Form' });
      return;
    }
    let payload = this.communityCreateForm.value;
    console.log(payload);
    this.communityService.createCommunityService(payload).subscribe({
      next:(res)=>{
        console.log(res);
        this.prepareForm();
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    })
  }
}
