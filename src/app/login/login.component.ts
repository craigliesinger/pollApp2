import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage: string = '';
  newUser: boolean = true; 
  
  loginForm: FormGroup; 
  email: FormControl = new FormControl('', Validators.compose([Validators.required, Validators.email]))
  password: FormControl = new FormControl('', [Validators.minLength(6), Validators.maxLength(25), Validators.required])
  passwordRepeat: FormControl = new FormControl('')
  matcher = new MyErrorStateMatcher();

  constructor(public authService: AuthService, private router: Router, private fb: FormBuilder, public dialog: MatDialog, private snackBar: MatSnackBar) { 
    
    this.loginForm = this.fb.group({
      displayName: [''],
      email: this.email,
      password: this.password,
      passwordRepeat: this.passwordRepeat
    }, {validator: this.checkPasswords}) 
    
   }
   

  ngOnInit() {
  }

  tryLogin(value) {
    if(!this.newUser) {
      this.authService.emailSignin(value)
        .then(res => {
          this.router.navigate(['/']);
        })
        .catch(err => {
          console.log(err.message)
          let snackBarRef = this.snackBar.open(err.message, '' , {
            duration: 5000,
          })
        })
    } else {
      if (this.loginForm.get('password').value == this.loginForm.get('passwordRepeat').value) {
        this.authService.registerUserWithEmail(value)
      } else {
        this.errorMessage = "passwords do not match"
      }
      
    }
    
  }

  checkPasswords(form: FormGroup) { 
    let pass = form.get('password').value
    let confirmPass = form.get('passwordRepeat').value
    console.log(pass, confirmPass)
    if (pass === confirmPass) {
      return null
    } else {
      return { notSame: true }
    }
  }

  setNewUser(state: boolean) {
    this.newUser = state
    this.errorMessage = ""
  }

  openResetPasswordDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // confirm email sent message
      let snackBarRef = this.snackBar.open(result, '' , {
        duration: 3000,
      })
    })
    
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}