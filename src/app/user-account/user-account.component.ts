import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  currentPlan: string = "free"

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(res => {
      switch (res.plan) {
        case 0:
          this.currentPlan = "Free"
          break;
        case 1:
          this.currentPlan = "Presenter"
          break;
        case 2:
          this.currentPlan = "Speaker"
          break;
        case 13:
          this.currentPlan = "Custom"
          break;
        default:
          break;
      }
    })
  }

}
