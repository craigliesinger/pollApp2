import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ChartsModule } from 'ng2-charts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavHolderComponent } from './nav-holder/nav-holder.component';
import { LoginComponent } from './login/login.component';
import { MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSliderModule, MatSlideToggleModule, MatRadioModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTabsModule, MatListModule } from '@angular/material';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { LiveSurveyComponent } from './live-survey/live-survey.component';
import { CreateQuestionOpenTextComponent } from './create-question-open-text/create-question-open-text.component';
import { CreateQuestionChoiceComponent } from './create-question-choice/create-question-choice.component';
import { QuestionContainerComponent } from './question-container/question-container.component';
import { FindSurveyByShortcodeComponent } from './find-survey-by-shortcode/find-survey-by-shortcode.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { AboutComponent } from './about/about.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { RoomFullComponent } from './room-full/room-full.component';

import { AuthGuard } from './Guards/auth.guard';
import { PaymentComponent } from './payment/payment.component';
import { WaitlistComponent } from './waitlist/waitlist.component';

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
    QuestionContainerComponent,
    FindSurveyByShortcodeComponent,
    UserAccountComponent,
    AboutComponent,
    TermsAndConditionsComponent,
    RoomFullComponent,
    PaymentComponent,
    WaitlistComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule, AngularFireFunctionsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSliderModule, MatSlideToggleModule, MatRadioModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTabsModule, MatListModule,
    ChartsModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
