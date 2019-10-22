import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SurveyService } from '../Services/survey.service';
import { OpenText } from '../Models/question';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-question-open-text',
  templateUrl: './create-question-open-text.component.html',
  styleUrls: ['./create-question-open-text.component.scss']
})
export class CreateQuestionOpenTextComponent implements OnInit {

  newOTquesetionForm: FormGroup; 
  question: FormControl = new FormControl('', Validators.compose([Validators.required]))
  @Input() surveyId: string;
  @Output() creatingQuestion = new EventEmitter<boolean>();

  constructor(public authService: AuthService, private survService: SurveyService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.newOTquesetionForm = this.fb.group({
      question: this.question,
    })
  }

  createQuestion(formValue) {
    // create the new question
    let newOTquestion = new OpenText
    newOTquestion.uid = this.survService.generateId()
    newOTquestion.question = formValue.question
    newOTquestion.type = "openText"
    this.survService.createOpenTextQuestionForSurvey(newOTquestion,this.surveyId).then(() => {
      this.creatingQuestion.emit(false)
      let snackBarRef = this.snackBar.open('Question Created', '' , {
        duration: 1000,
      })
    })
    .catch((e) => {
      this.creatingQuestion.emit(false)
      let snackBarRef = this.snackBar.open(e, '' , {
        duration: 5000,
      })
    })
  }

  closeNoSave() {
    this.creatingQuestion.emit(false)
  }

}
