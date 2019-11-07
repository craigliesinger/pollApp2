import { Component, OnInit, Input } from '@angular/core';
import { Question, OpenText, Choice } from '../Models/question';
import { Observable } from 'rxjs';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-question-container',
  templateUrl: './question-container.component.html',
  styleUrls: ['./question-container.component.scss']
})
export class QuestionContainerComponent implements OnInit {

  @Input() questions: Observable<Question[]>
  @Input() liveQuestion: OpenText | Choice
  @Input() survOneTime: Survey
  creatingQuestion: boolean = false
  showOpen: boolean = false
  showChoice: boolean = false

  constructor(private survService: SurveyService,  private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  setQuestionLive(q: Question) {
    if (!this.liveQuestion) {
      this.survService.setQuestionLive(this.survOneTime.uid, q.uid)
    } else if (q.uid == this.liveQuestion.uid) {
      this.removeLiveQuestion()
    } else {
      this.survService.setQuestionLive(this.survOneTime.uid, q.uid)
    }
  }

  removeLiveQuestion() {
    this.survService.removeLiveQuestion(this.survOneTime.uid)
  }

  creatingOTQuestion(newQuestion: OpenText) {
    this.creatingQuestion = false
    this.showOpen = false
    this.showChoice = false

    if (newQuestion) {
      this.survService.createOpenTextQuestionForSurvey(newQuestion,this.survOneTime.uid).then(() => {
        let snackBarRef = this.snackBar.open('Question Created', '' , {
          duration: 1000,
        })
      })
      .catch((e) => {
        let snackBarRef = this.snackBar.open(e, '' , {
          duration: 5000,
        })
      })
    }
  }

  creatingMCQuestion(newQuestion: Choice) {
    this.creatingQuestion = false
    this.showOpen = false
    this.showChoice = false

    if (newQuestion) {
      this.survService.createMultiChoiceQuestionForSurvey(newQuestion,this.survOneTime.uid).then(() => {
        let snackBarRef = this.snackBar.open('Question Created', '' , {
          duration: 1000,
        })
      })
      .catch((e) => {
        let snackBarRef = this.snackBar.open(e, '' , {
          duration: 5000,
        })
      })
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
