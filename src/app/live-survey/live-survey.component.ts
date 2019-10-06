import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../Services/survey.service';
import { Survey } from '../Models/survey';

@Component({
  selector: 'app-live-survey',
  templateUrl: './live-survey.component.html',
  styleUrls: ['./live-survey.component.scss']
})
export class LiveSurveyComponent implements OnInit {

  survey: Survey

  constructor(private route: ActivatedRoute, private survService: SurveyService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('uid');
    this.survService.getSurveyWithId(id).subscribe(res => {
      this.survey = res
    })
  }

  

  

}
