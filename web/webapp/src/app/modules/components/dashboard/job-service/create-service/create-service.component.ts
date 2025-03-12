import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit{
  serviceCreateForm!:FormGroup;
  constructor(private formBuilder: FormBuilder,private router:Router){}
  ngOnInit(): void {
      this.prepareForm();
  }
  prepareForm(){
    this.serviceCreateForm = this.formBuilder.group({
      serviceName: ['',Validators.required],
      serviceCharge: ['',Validators.required]
    });
  }
  goBack(){
    this.router.navigate(['service/list'])
  }
}
