import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';
import { AuthService } from '../Services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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

  constructor(private route: ActivatedRoute, private router: Router, private survService: SurveyService, public auth: AuthService) { }

  async ngOnInit() {
    console.log('ng on init called')
    const id = this.route.snapshot.paramMap.get('uid');
    this.survService.getSurveyWithIdOnce(id)
    this.survey = this.survService.getSurveyWithId(id)
    
    this.survey.pipe(take(1)).subscribe(res => {
      this.host = res.owner
      this.survOneTime = res
      this.survService.changeSurveyCount(this.survOneTime,1)
    })

    this.survey.subscribe(res => {
      this.surv = res
    })

    this.tracker = this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        console.log('started Nav away ', this.surv.uid)
        //remove 1 user count
        this.survService.changeSurveyCount(this.surv,-1)
      }
    })

  }

  ngOnDestroy() {
    this.tracker.unsubscribe()
  }

  toggleCreatingQuestion(creating: boolean) {
    this.creatingQuestion = creating
    this.showOpen = false
    this.showChoice = false
  }

  showOpenForm() {
    this.creatingQuestion = true
    this.showOpen = true
  }

}
