import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ChartsModule } from 'ng2-charts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavHolderComponent } from './nav-holder/nav-holder.component';
import { LoginComponent } from './login/login.component';
import { MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSliderModule, MatSlideToggleModule, MatRadioModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { LiveSurveyComponent } from './live-survey/live-survey.component';
import { CreateQuestionOpenTextComponent } from './create-question-open-text/create-question-open-text.component';
import { CreateQuestionChoiceComponent } from './create-question-choice/create-question-choice.component';
import { QuestionContainerComponent } from './question-container/question-container.component';

@NgModule({
  declarations: [
    AppComponent,
    NavHolderComponent,
    LoginComponent,
    ResetPasswordComponent,
    HomeScreenComponent,
    CreateSurveyComponent,
    LiveSurveyComponent,
    CreateQuestionOpenTextComponent,
    CreateQuestionChoiceComponent,
    QuestionContainerComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSliderModule, MatSlideToggleModule, MatRadioModule, MatCheckboxModule, MatTooltipModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
