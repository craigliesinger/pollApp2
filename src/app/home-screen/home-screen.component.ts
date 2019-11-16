import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {
  
  ownedSurveys: Observable<Survey[]>

  constructor(private survService: SurveyService, public auth: AuthService) { }

  async ngOnInit() {
    if (await this.auth.isLoggedIn()) {
      this.ownedSurveys = this.survService.getSurveysForUser(this.auth.getLoggedInUserId())
    }
  }

}
