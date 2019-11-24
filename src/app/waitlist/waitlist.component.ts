import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SurveyService } from '../Services/survey.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.scss']
})
export class WaitlistComponent implements OnInit {

  waitlistForm: FormGroup; 
  email: FormControl = new FormControl('', Validators.compose([Validators.required, Validators.email]))
  submitted: boolean = false

  constructor(private survService: SurveyService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.waitlistForm = this.fb.group({
      email: this.email,
    })
  }

  addToWaitlist(fv) {
    const addEmail = fv.email
    this.survService.addInterestedUser(addEmail)
    let snackBarRef = this.snackBar.open('Thanks! We will email know as soon as we are ready to offer our Presenter package', '' , {
      duration: 6000,
    })
    this.submitted = true
  }

}
