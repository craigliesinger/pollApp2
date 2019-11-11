import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SurveyService } from '../Services/survey.service';
import { OpenText } from '../Models/question';

@Component({
  selector: 'app-create-question-open-text',
  templateUrl: './create-question-open-text.component.html',
  styleUrls: ['./create-question-open-text.component.scss']
})
export class CreateQuestionOpenTextComponent implements OnInit {

  newOTquesetionForm: FormGroup; 
  question: FormControl = new FormControl('', Validators.compose([Validators.required]))
  @Input() surveyId: string;
  @Output() creatingQuestion = new EventEmitter<OpenText>();

  constructor(public authService: AuthService, private survService: SurveyService, private router: Router, private fb: FormBuilder) { }

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
    this.creatingQuestion.emit(newOTquestion)
  }

  closeNoSave() {
    this.creatingQuestion.emit()
  }

}
