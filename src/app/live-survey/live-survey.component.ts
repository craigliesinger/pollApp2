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

  screenWidth: number;

  expQuestion: boolean = false
  survey: Observable<Survey>
  host: string
  surv: Survey
  survOneTime: Survey
  tracker: Subscription
  questions: Observable<Question[]>
  currentUser: string
  userCount: number
  liveQuestion: OpenText | Choice
  userQuestionForm: FormGroup
  userChoiceQuestionForm: FormGroup 
  userChoiceMultiQuestionForm: FormGroup
  pickedAnOption: boolean = false
  answerSubmitted: boolean = false
  answeredQuestions: string[] = []
  lastRatingValue: number = 0
  currentTotalVibe: number = 0
  vibeHistory: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  sentimentAssessment: string
  sortPositive: boolean = true
  // FOR CHARTING
  public vibeChartData: ChartDataSets[] = [{}]
  public lineChartLabels: Label[] = [
    "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"
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
          display:true
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
          display: false
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
     // set screenWidth on page load
     this.screenWidth = window.innerWidth;
     window.onresize = () => {
       // set screenWidth on screen size change
       this.screenWidth = window.innerWidth;
     };

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
        this.survService.getQuestion(res.uid,res.liveQuestionUid).subscribe(qRes => {
          this.launchQuestion(qRes)
          this.createVisualForQuestion(qRes)
        })
      } else {
        this.liveQuestion = null
      }
      if (this.currentTotalVibe != res.combinedRating && this.currentUser == this.host && this.userCount > 0) {
        this.currentTotalVibe = res.combinedRating
        this.logVibe(this.currentTotalVibe / this.userCount)
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

  logVibe(value: number) {
    this.vibeHistory = [...this.vibeHistory.slice(1,20),value]
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

  removeLiveQuestion() {
    this.survService.removeLiveQuestion(this.survOneTime.uid)
  }

  ngOnDestroy() {
    this.tracker.unsubscribe()
  }

  

  sendRatingUpdate(ev) {
    let delta = ev.value - this.lastRatingValue
    console.log(delta)
    this.survService.changeSurveyRating(this.surv, delta)
    this.lastRatingValue = ev.value
  }

}
