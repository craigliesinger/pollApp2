import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {

  errorMessage: string = '';
  
  newSurveyForm: FormGroup; 
  title: FormControl = new FormControl('', Validators.compose([Validators.required]))

  constructor(public authService: AuthService, private survService: SurveyService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.newSurveyForm = this.fb.group({
      title: this.title,
    })
  }

  createSurvey(formValue) {
    // create the new survey
    let newSurvey = new Survey
    newSurvey.uid = this.survService.generateId()
    newSurvey.url = newSurvey.uid
    newSurvey.title = formValue.title
    newSurvey.owner = this.authService.getLoggedInUserId()
    this.survService.createSurvey(newSurvey).then(() => {
      this.router.navigate(['/survey/',newSurvey.url]);
    })
    .catch((e) => {
      let snackBarRef = this.snackBar.open(e, '' , {
        duration: 5000,
      })
    })
  }

}
