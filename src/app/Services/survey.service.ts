import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Survey } from '../Models/survey';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private readonly afs: AngularFirestore) { }

  /* Generate random ID */
  generateId() {
    return this.afs.createId();
  }

  /* Get survey by UID */
  getSurveyWithId(surveyUid: string): Observable<Survey> {
    return this.afs.doc<Survey>('surveys/' + surveyUid).valueChanges()
  }

  getSurveyWithIdOnce(surveyUid: string) {
    return this.afs.doc<Survey>('surveys/' + surveyUid).valueChanges().pipe(take(1))
  }

  /* Create a new survey */
  createSurvey(survey) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc<any>('surveys/'+survey.uid).set(Object.assign({}, survey))
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  /* Get surveys by User ID */
  getSurveysForUser(userId: string): Observable<Survey[]> {
    return this.afs.collection<Survey>('surveys', ref => ref.where('owner', '==', userId)).valueChanges()
  }

  /* Change count of Users in survey */
  changeSurveyCount(survey: Survey, count: number) {
    const increment = firestore.FieldValue.increment(count)
    const survLoc = this.afs.doc<Survey>('surveys/'+survey.uid)
    survLoc.update({activeParticipants: increment})
  }

}
