import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavHolderComponent } from './nav-holder/nav-holder.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { LiveSurveyComponent } from './live-survey/live-survey.component';
import { QuestionContainerComponent } from './question-container/question-container.component';

const routes: Routes = [
  { path: '', component: NavHolderComponent,
    children: [
      { path: '', component: HomeScreenComponent }, 
      { path: 'newsurvey', component: CreateSurveyComponent },
      { path: 'survey/:uid', component: LiveSurveyComponent },
      { path: 'survey/:uid/q', component: QuestionContainerComponent }
    ] 
  },
  { path: 'login', component: LoginComponent},
  { path: 'resetpassword', component: ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
