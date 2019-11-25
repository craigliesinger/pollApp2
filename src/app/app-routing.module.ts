import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavHolderComponent } from './nav-holder/nav-holder.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { LiveSurveyComponent } from './live-survey/live-survey.component';
import { QuestionContainerComponent } from './question-container/question-container.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { AboutComponent } from './about/about.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { RoomFullComponent } from './room-full/room-full.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: '', component: NavHolderComponent,
    children: [
      { path: '', component: HomeScreenComponent }, 
      { path: 'newsurvey', component: CreateSurveyComponent, canActivate: [AuthGuard]},
      { path: 'survey/:uid', component: LiveSurveyComponent },
      { path: 'survey/:uid/q', component: QuestionContainerComponent },
      { path: 'login', component: LoginComponent},
      { path: 'account', component: UserAccountComponent, canActivate: [AuthGuard]},
      { path: 'resetpassword', component: ResetPasswordComponent},
      { path: 'about', component: AboutComponent},
      { path: 'about/pricing', component: AboutComponent},
      { path: 'terms', component: TermsAndConditionsComponent},
      { path: 'surveyfull/:num', component: RoomFullComponent},
      { path: '**', redirectTo: '' },
    ] 
  },
  { path: 'terms', component: TermsAndConditionsComponent},
  { path: '**', redirectTo: '' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
