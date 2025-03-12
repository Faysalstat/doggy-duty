import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  communityId!:number;
  communityCreateForm!: FormGroup;
  serviceList!: CommunityDTO[];
  isEdit:boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.communityId = +params['id']; // Retrieve the ID from the route parameters
      if(this.communityId){
        this.isEdit = true;
        this.fetchComunityDetails(this.communityId); // Load the item data for editing
      }
      
    });
    this.getAllServiceList();
    this.prepareForm();
  }
  fetchComunityDetails(id:number){
    this.communityService.getCommunityById(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.populateForm(res.body);
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    })
  }
  getAllServiceList() {
    this.communityService.getAllService().subscribe({
      next: (res) => {
        this.serviceList = res.body;
      },
    });
  }
  private populateForm(communityData: CommunityDTO): void {
    this.communityCreateForm.patchValue({
      id: communityData.id,
      communityName: communityData.communityName,
      communityAddress: communityData.communityAddress,
      latitude: communityData.latitude,
      longitude: communityData.longitude,
      camOfcommunity: communityData.camOfcommunity,
      gateCode: communityData.gateCode,
      phone: communityData.phone,
      email: communityData.email,
      lockBoxCode: communityData.lockBoxCode,
      specialRequest: communityData.specialRequest,
      noOfPetStation: communityData.noOfPetStation,
      noOfGarbageBin: communityData.noOfGarbageBin,
      chargePerPetStation: communityData.chargePerPetStation,
      chargePerGarbageBin: communityData.chargePerGarbageBin,
      frequency: communityData.frequency,
      startingDate: communityData.startingDate,
      lastServedDate: communityData.lastServedDate,
      scheduledDate: communityData.scheduledDate
    });
  }
  prepareForm() {
    this.communityCreateForm = this.formBuilder.group({
      id:[],
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
      chargePerPetStation: [null],
      chargePerGarbageBin: [null],
      frequency:[null],
      startingDate:[null],
      lastServedDate:[null],
      scheduledDate:[null]
    });
    this.communityCreateForm.get("startingDate")?.valueChanges.subscribe((data)=>{
      if(!this.isEdit){
        this.communityCreateForm.get("scheduledDate")?.setValue(data);
      }
    })
  }
  goBack() {
    this.router.navigate(['community/list']);
  }
  onSubmit() {
    if(this.communityCreateForm.invalid){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Form' });
      return;
    }
    let payload = this.communityCreateForm.value;
    if(this.isEdit){
      this.onUpdate(payload);
    }else{
      this.onSave(payload);
    }
    
  }

  onSave(payload:any){
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
  onUpdate(payload:any){
    payload.id = this.communityId;
    this.communityService.updateCommunityService(payload).subscribe({
      next:(res)=>{
        console.log(res);
        this.fetchComunityDetails(this.communityId); // Load the item data for editing
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    })
  }
}
