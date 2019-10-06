import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  errorMessage: string = '';
  resetForm: FormGroup; 
  email: FormControl = new FormControl('', Validators.compose([Validators.required, Validators.email]))
  

  constructor(public authService: AuthService, private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<ResetPasswordComponent>) {
    this.resetForm = this.fb.group({
      email: this.email
    }) 
  }

  ngOnInit() {
  }

  sendResetPasswordLink(value) {
    this.authService.resetPassword(value.email).then(() => this.dialogRef.close('Reset email sent. Check your inbox.'))
    .catch((e) => this.dialogRef.close(e))
  }

}
