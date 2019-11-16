import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../Services/survey.service';
import { MatSnackBar } from '@angular/material';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-find-survey-by-shortcode',
  templateUrl: './find-survey-by-shortcode.component.html',
  styleUrls: ['./find-survey-by-shortcode.component.scss']
})
export class FindSurveyByShortcodeComponent implements OnInit {

  findSurveyForm: FormGroup; 
  code: FormControl = new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)]))

  constructor(private survService: SurveyService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.findSurveyForm = this.fb.group({
      code: this.code
    })
  }

  async searchForSurvey(formValue) {
    let code = formValue.code
    this.survService.getSurveyWithShortcode(code).subscribe(res => {
      if (res.length > 0) {
        let goToUrl = res[0].url
        this.router.navigate(['/survey/',goToUrl])
      } else {
        let snackBarRef = this.snackBar.open("⚠️  No survey found. Please check the code and try again.", '' , {
          duration: 5000,
        })
      }
    })
  }

}
