import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';
import { AuthService } from '../Services/auth.service';
import { Subscription, Observable, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { Question, OpenText, Choice, Answer } from '../Models/question';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-live-survey',
  templateUrl: './live-survey.component.html',
  styleUrls: ['./live-survey.component.scss']
})
export class LiveSurveyComponent implements OnInit {

  survey: Observable<Survey>
  host: string
  surv: Survey
  survOneTime: Survey
  tracker: Subscription
  creatingQuestion: boolean = false
  showOpen: boolean = false
  showChoice: boolean = false
  questions: Observable<Question[]>
  currentUser: string
  userCount: number
  liveQuestion: OpenText | Choice
  //liveQuestionObservable: Observable<Question>
  userQuestionForm: FormGroup
  userChoiceQuestionForm: FormGroup 
  userChoiceMultiQuestionForm: FormGroup
  pickedAnOption: boolean = false
  answerSubmitted: boolean = false
  answeredQuestions: string[] = []
  lastRatingValue: number = 0
  vibeHistory: number[] = []
  sentimentAssessment: string
  sortPositive: boolean = true
  // FOR CHARTING
  public vibeChartData: ChartDataSets[] = [{}]
  public lineChartLabels: Label[] = [
    "1","2","3","4","5","6","7","8","9","10",
    "11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30",
    "31","32","33","34","35","36","37","38","39","40",
    "41","42","43","44","45","46","47","48","49","50",
    "51","52","53","54","55","56","57","58","59","60"
  ]
  public lineChartType: ChartType = 'line'
  public lineChartOptions: ChartOptions = {
    animation:{
      duration: 0
    },
    hover: {
        animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    responsive: true,
    scales : {
      yAxes: [{
        gridLines: {
          display:false
        }, 
        ticks: {
          stepSize: 5,
          max : 5,
          min: -5
        }
      }],
      xAxes: [{
        display: false,
        gridLines: {
          display:false
        },
        ticks: {
          stepSize: 10,
          max : 60,
          min: 0
        }
      }]
    }
  }
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales : {
      yAxes: [{
        gridLines: {
          display:false
      }, 
          ticks: {
          beginAtZero: true,
          display: false
          }
      }]
    }
  }
  public barChartLegend: boolean = false
  public barChartLabels: Label[] = ["a"]
  public barChartType: ChartType = 'bar'
  public barChartData: ChartDataSets[] = [{}]

  @HostListener('window:beforeunload', ['$event'])
      beforeunloadHandler(event) {
        this.removeAttendee()
      }

  constructor(private route: ActivatedRoute, private router: Router, private survService: SurveyService, public auth: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.userQuestionForm = this.fb.group({
      response: new FormControl('', Validators.compose([Validators.required]))
    })
    this.userChoiceMultiQuestionForm = this.fb.group({
      choices: this.fb.array([])
    })
    this.userChoiceQuestionForm = this.fb.group({
      options: new FormControl('', Validators.compose([Validators.required]))
    })
  }

  async ngOnInit() {
    console.log('ng on init called')
    const id = this.route.snapshot.paramMap.get('uid');
    this.survService.getSurveyWithIdOnce(id)
    this.survey = this.survService.getSurveyWithId(id)
    
    
    this.survey.pipe(take(1)).subscribe(res => {
      this.host = res.owner
      this.survOneTime = res
      if (this.auth.userUid) {
        this.currentUser = this.auth.userUid
        if (this.currentUser != this.host) {
          this.survService.addUserAttendee(this.survOneTime, this.currentUser)
          this.survService.changeSurveyRating(this.survOneTime, this.lastRatingValue)
        } else {
          this.monitorVibe()
        }
      } else {
        this.auth.afAuth.auth.signInAnonymously().then(res => {
          this.currentUser = res.user.uid
          this.survService.addUserAttendee(this.survOneTime, this.currentUser)
          this.survService.changeSurveyRating(this.survOneTime, this.lastRatingValue)
        })
      }
      
      this.questions = this.survService.getAllQuestionsForSurvey(res.uid)
    })

    this.survey.subscribe(res => {
      this.surv = res
      let uCount = res.activeParticipants as String[]
      if (uCount) {
        this.userCount = uCount.length
      } else {
        this.userCount = 0
      }
      if (res.liveQuestionUid != null) {
        //this.liveQuestionObservable = this.survService.getQuestion(res.uid,res.liveQuestionUid)
        this.survService.getQuestion(res.uid,res.liveQuestionUid).subscribe(qRes => {
          this.launchQuestion(qRes)
          this.createVisualForQuestion(qRes)
        })
      } else {
        this.liveQuestion = null
      }
    })

    this.tracker = this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        //remove 1 user count
        this.removeAttendee()
      }
    })

  }

  get choices() {
    return this.userChoiceMultiQuestionForm.get('choices') as FormArray
  }

  monitorVibe() {
    let timer = interval(1000)
    timer.subscribe(_ => {
      if (this.userCount > 0) {
        let totalRating = this.surv.combinedRating as number
        this.logVibe(totalRating / this.userCount)
      }
    })
  }

  logVibe(value: number) {
    if (this.vibeHistory.length < 60) {
      this.vibeHistory.push(value)
    } else {
      this.vibeHistory = [...this.vibeHistory.slice(1,60),value]
    }
    this.vibeChartData = [{data: this.vibeHistory, label: "vibe"}]
  }

  noItemSelected() {
    let count = this.choices.length
    for (let i=0; i < count; i++) {
      if (this.choices.at(i).value) {
        this.pickedAnOption = true
        return
      }
    }
    this.pickedAnOption = false
    return
  }

  createVisualForQuestion(q: Question) {
    if (q.type == 'multiChoice') {
      this.createBarChartForChoiceQuestion(q)
    } else if (q.type == "openText") {
      this.createTextAnalysis(q)
    }
  }

  sortSentiment() {
    if (this.sortPositive) {
      this.liveQuestion.answers.sort((a,b) => {
        return b.sentiment.score - a.sentiment.score
      })
      this.sortPositive = false
    } else {
      this.liveQuestion.answers.sort((a,b) => {
        return a.sentiment.score - b.sentiment.score
      })
      this.sortPositive = true
    }
  }

  createTextAnalysis(q: Question) {
    // anything for sentiment?
    if (q.sentiment) {
      let relativeScore = q.sentiment.score / q.sentiment.words.length
      let comp = q.sentiment.comparative
      if (comp > 1) {
        this.sentimentAssessment = "positive"
      } else if (comp < -1) {
        this.sentimentAssessment = "negative"
      } else if (comp > 0.1) {
        this.sentimentAssessment = "slightly positive"
      } else if (comp < -0.1) {
        this.sentimentAssessment = "slightly negative"
      } else {
        if (q.sentiment.words.length / q.sentiment.tokens.length > 0.25) {
          this.sentimentAssessment = "mixed"
        } else {
          this.sentimentAssessment = "neutral"
        }
      }
    }
  }

  createBarChartForChoiceQuestion(q: Question) {
    this.barChartLabels = []
    this.barChartData = []
    let answers = q.answers as Answer[]
    var tempData = []
    q.options.forEach(op => {
      var count = 0
      this.barChartLabels.push(op)
      answers.forEach(ans => {
        ans.responce.forEach(res => {
          if (res == op) {
            count = count + 1
          }
        })
      })
      tempData.push(count)
    })
    this.barChartData.push({data: tempData, label: 'Responces'})
  }

  setQuestionLive(q: Question) {
    this.survService.setQuestionLive(this.survOneTime.uid, q.uid)
  }

  removeLiveQuestion() {
    this.survService.removeLiveQuestion(this.survOneTime.uid)
  }

  checkIfAnswered(q: Question) {
    this.answerSubmitted = false
    this.answeredQuestions.forEach(aq => {
      if (aq == q.uid) {
        this.answerSubmitted = true
      }
    })
  }

  launchQuestion(q: Question) {   
    this.checkIfAnswered(q) 
    // remove any currently live questions
    this.questions.forEach(res => {res.forEach(x => {x.status = "prep"})})
    //check question type
      if (q.type == 'openText') {
        // create Form 
        this.userQuestionForm = this.fb.group({
          response: new FormControl('', Validators.compose([Validators.required]))
        })
        
      } else if (q.type == 'multiChoice') {
        // Check if multi Selection allowed
        if ((q as Choice).multiSelect) {
              (q as Choice).options.forEach(op => {
                this.choices.push(this.fb.control(false))
              })
        } 
      } 
      // set question live
      q.status = "live"
      this.liveQuestion = q
  }

  submitUserOpenTextAnswer(v) {
    let ans: string[] = []
    ans.push(v.response)
    this.addAnswer(ans)
  }

  submitUserMultiChoiceAnswer(v) {
    let ans: string[] = []
    ans.push(v.options)
    this.addAnswer(ans)
  }

  submitUserMultiChoiceMultiAnswer(v) {
    let ans: string[] = []
    let count = this.choices.length
    for (let i=0; i < count; i++) {
      if (this.choices.at(i).value) {
        ans.push(this.liveQuestion.options[i])
      }
    }
    this.addAnswer(ans)
  }

  addAnswer(answer: string[]) {
    this.survService.addAnswerToQuestion(this.survOneTime.uid, this.liveQuestion, answer, this.currentUser)
    let snackBarRef = this.snackBar.open('✅ Answer Submitted', '' , {
      duration: 5000,
    })
    this.answerSubmitted = true
    this.answeredQuestions.push(this.liveQuestion.uid)
  }


  removeAttendee() {
    if (this.currentUser != this.host) {
      this.survService.changeSurveyRating(this.surv, -this.lastRatingValue)
      this.survService.removeUserAttendee(this.survOneTime, this.currentUser)
    }
  }

  ngOnDestroy() {
    this.tracker.unsubscribe()
  }

  creatingOTQuestion(newQuestion: OpenText) {
    this.creatingQuestion = false
    this.showOpen = false
    this.showChoice = false

    if (newQuestion) {
      this.survService.createOpenTextQuestionForSurvey(newQuestion,this.surv.uid).then(() => {
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
      this.survService.createMultiChoiceQuestionForSurvey(newQuestion,this.surv.uid).then(() => {
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

  sendRatingUpdate(ev) {
    let delta = ev.value - this.lastRatingValue
    console.log(delta)
    this.survService.changeSurveyRating(this.surv, delta)
    this.lastRatingValue = ev.value
  }

}
