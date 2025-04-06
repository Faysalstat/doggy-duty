import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { NotificationService } from '../../shared-services/notification-service.service';
import { User } from '../../models/models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    password!: string;
    loginForm!: FormGroup;
    message!:string;
    visible: boolean = false;
    email: string = '';
  constructor(
    public layoutService: LayoutService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService:NotificationService
    
    ) {}

  ngOnInit(): void {
    this.prepareForm(null);
  }
  prepareForm(formData: any) {
    formData = new User();
    this.loginForm = this.formBuilder.group({
      username: [formData.username, [Validators.required]],
      password: [formData.password, [Validators.required]],
      // address: [formData.personAddress],
    });
  }
  signIn(){
    const params:Map<string,any> = new Map();
    const user = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };
    params.set("user",user);
    this.authService.signIn(params).subscribe({
      next:(res)=>{
        if(res.isSuccess){
          localStorage.setItem('token', res.body.token);
          localStorage.setItem('userId', res.body.userid);
          localStorage.setItem('username', res.body.username);
          localStorage.setItem('personName', res.body.personName);
          localStorage.setItem('userRole',res.body.userRole);
          this.router.navigate(["/"]);
        }else{
          this.notificationService.showMessage("ERROR!","Authentication Failed " + res.message,"OK",2000);
          
        }
      },
      error:(err)=>{
        this.notificationService.showErrorMessage("ERROR!",err.message,"OK",2000)
      },
      complete: ()=>{}
    })
  }
  showDialog() {
    this.visible = true;
}
sendResetToken(){
  this.visible = false;
  if(this.email && this.email!=''){
    this.authService.sendResetToken(this.email).subscribe({
      next:(res:any)=>{ 
        if(res.isSuccess){
          this.notificationService.showMessage("SUCCESS!","Reset token sent to your email","OK",2000);
        }else{
          this.notificationService.showMessage("ERROR!","Reset token could not be sent " + res.message,"OK",2000);
          
        }
      }
      ,error:(err:any)=>{
        this.notificationService.showErrorMessage("ERROR!",err.message,"OK",2000)
      }
    })
  }else{
    this.notificationService.showErrorMessage("Invalid Form","Provide Email","OK",2000)
  }

}
}
