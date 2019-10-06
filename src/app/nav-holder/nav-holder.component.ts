import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-nav-holder',
  templateUrl: './nav-holder.component.html',
  styleUrls: ['./nav-holder.component.scss']
})
export class NavHolderComponent implements OnInit {

  screenWidth: number;
  public isLoggedIn: Boolean;
  public user_displayName: String;
  public user_email: String; 

  constructor(public authService: AuthService) {
    this.authService.afAuth.authState.subscribe(
      (auth) => {
        if (auth == null) {
          console.log("Logged out");
          this.isLoggedIn = false;
          this.user_displayName = '';
          this.user_email = '';
        } else {
          this.isLoggedIn = true;
          this.user_displayName = auth.displayName;
          this.user_email = auth.email;
          console.log("Logged in");
          console.log(auth);
        }
      }
    );
  }

  ngOnInit() {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

  tryLogout() {
    console.log("trying loggout");
    this.authService.logout()
    .then(res => {
      console.log("logout successful");
    }, err => {
      console.log(err);
    })
  }

}
