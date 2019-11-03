import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Question } from '../Models/question';


@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {

  errorMessage: string = '';
  
  newSurveyForm: FormGroup; 
  title: FormControl = new FormControl('', Validators.compose([Validators.required]))
  creatingQuestion: boolean = false
  showOpen: boolean = false
  showChoice: boolean = false
  questions: Observable<Question[]>
  newId: string
  preppedQuestions: Question[] = []

  constructor(public authService: AuthService, private survService: SurveyService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.newSurveyForm = this.fb.group({
      title: this.title,
    })
    this.newId = this.survService.generateId()

  }

  createSurvey(formValue) {
    // create the new survey
    let newSurvey = new Survey
    newSurvey.uid = this.newId
    newSurvey.url = newSurvey.uid
    newSurvey.title = formValue.title
    newSurvey.owner = this.authService.getLoggedInUserId()
    this.survService.createSurvey(newSurvey).then(() => {
      this.preppedQuestions.forEach(item => {
        this.survService.createQuestionForSurvey(item,newSurvey.uid)
      })
      this.router.navigate(['/survey/',newSurvey.url]);
    })
    .catch((e) => {
      let snackBarRef = this.snackBar.open(e, '' , {
        duration: 5000,
      })
    })
  }

  addQuestion(newQuestion: Question) {
    this.creatingQuestion = false
    this.showOpen = false
    this.showChoice = false

    if (newQuestion) {
      this.preppedQuestions.push(newQuestion)
    }
  }

  showOpenForm() {
    this.creatingQuestion = true
    this.showOpen = true
  }

  showChoiceForm() {
    this.creatingQuestion = true
    this.showChoice = true
  }

}
