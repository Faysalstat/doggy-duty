import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { NotificationService } from '../../shared-services/notification-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private authService:AuthService,
    private notificationService:NotificationService,
  private router:Router) {
    this.resetForm = this.fb.group(
      {
        id:['',Validators.required],
        username: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const token = params['token'];
      console.log('Token from URL:', token);
      this.verifyToken(token);
    });
  }
  verifyToken(token:any){
    this.authService.verifyResetToken(token).subscribe({
      next:(res)=>{
        console.log(res.body);
        this.resetForm.get('id')?.setValue(res.body.userId);
        this.resetForm.get('username')?.setValue(res.body.username);
      }
    })
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      let payload = this.resetForm.value;
      this.authService.resetPassword(payload).subscribe({
        next:(res)=>{
          this.notificationService.showMessage("SUCCESS","Update Successful" + res.message,"OK",2000);
          this.router.navigate(['/auth']);
        },
        error:(res)=>{
          this.notificationService.showMessage("ERROR!","Password Update Failed" + res.message,"OK",2000);
        }
      })
    }
  }
}
