import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SurveyService } from '../Services/survey.service';
import { Choice } from '../Models/question';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-question-choice',
  templateUrl: './create-question-choice.component.html',
  styleUrls: ['./create-question-choice.component.scss']
})
export class CreateQuestionChoiceComponent implements OnInit {

  newMCquesetionForm: FormGroup; 
  question: FormControl = new FormControl('', Validators.compose([Validators.required]))
  allowMultiSelection:boolean = false

  @Input() surveyId: string;
  @Output() creatingQuestion = new EventEmitter<boolean>();

  constructor(public authService: AuthService, private survService: SurveyService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.newMCquesetionForm = this.fb.group({
      question: this.question,
      choices: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    })
  }

  get choices() {
    return this.newMCquesetionForm.get('choices') as FormArray
  }

  addChoice() {
    this.choices.push(this.fb.control('', Validators.required));
  }

  removeChoice(index) {
    this.choices.removeAt(index)
  }

  toggleMultiSelect(e) {
    if (e.checked) {
      this.allowMultiSelection = true
    } else {
      this.allowMultiSelection = false
    }
  }

  createQuestion(formValue) {
    // create the new question
    let newMCquestion = new Choice
    newMCquestion.uid = this.survService.generateId()
    newMCquestion.question = formValue.question
    newMCquestion.options = formValue.choices
    newMCquestion.multiSelect = this.allowMultiSelection
    newMCquestion.type = "multiChoice"
    console.log(newMCquestion)
    this.survService.createMultiChoiceQuestionForSurvey(newMCquestion,this.surveyId).then(() => {
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
