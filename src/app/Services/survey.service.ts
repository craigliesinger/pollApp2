import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Survey } from '../Models/survey';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { take } from 'rxjs/operators';
import { Question, OpenText, Choice, Answer } from '../Models/question';


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

  /* Change count of Users in survey 
  changeSurveyCount(survey: Survey, count: number) {
    const increment = firestore.FieldValue.increment(count)
    const survLoc = this.afs.doc<Survey>('surveys/'+survey.uid)
    survLoc.update({activeParticipants: increment})
  }*/

  addUserAttendee(survey: Survey, userId: string) {
    let ref = this.afs.doc<Survey>('surveys/'+survey.uid)
    ref.update({
      activeParticipants: firebase.firestore.FieldValue.arrayUnion(userId) as any
    })
  }

  removeUserAttendee(survey: Survey, userId: string) {
    let ref = this.afs.doc<Survey>('surveys/'+survey.uid)
    ref.update({
      activeParticipants: firebase.firestore.FieldValue.arrayRemove(userId) as any
    })
  }

  changeSurveyRating(survey: Survey, delta: number) {
    let ref = this.afs.doc<Survey>('surveys/'+survey.uid)
    ref.update({
      combinedRating: firebase.firestore.FieldValue.increment(delta) as any
    })
  }

  /* Get all questions associated with a survey */
  getAllQuestionsForSurvey(surveyUid) {
    return this.afs.collection<Question>('surveys/' + surveyUid + '/questions').valueChanges()
  }

  /* Get a question by uid */
  getQuestion(surveyUid: string, qUid: string) {
    return this.afs.doc<Question>('surveys/' + surveyUid + '/questions/' + qUid).valueChanges()
  }

  /* set UID of live question in a survey */
  setQuestionLive(surveyUid, qUid) {
    let ref =  this.afs.doc<Survey>('surveys/' + surveyUid)
    ref.update({
      "liveQuestionUid": qUid
    })
  }

  /* remove any live question in a survey */
  removeLiveQuestion(surveyUid) {
    let ref =  this.afs.doc<Survey>('surveys/' + surveyUid)
    ref.update({
      "liveQuestionUid": null
    })
  }

  /* Create a new open text question to a survey */
  createOpenTextQuestionForSurvey(OTquestion: OpenText, surveyUid: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc<any>('surveys/'+surveyUid+'/questions/'+OTquestion.uid).set(Object.assign({}, OTquestion))
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  /* Create a new multi-choice question to a survey */
  createMultiChoiceQuestionForSurvey(MCquestion: Choice, surveyUid: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc<any>('surveys/'+surveyUid+'/questions/'+MCquestion.uid).set(Object.assign({}, MCquestion))
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

   /* Create a new question to a survey */
   createQuestionForSurvey(question: Question, surveyUid: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc<any>('surveys/'+surveyUid+'/questions/'+question.uid).set(Object.assign({}, question))
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  /* Add answer to question */
  addAnswerToQuestion(surveyUid: string, question: Question, answer: string[], responder: string) {
    let newAnswer: Answer = {responce: answer, responder: responder}
    let ref = this.afs.doc<Question>('surveys/'+surveyUid+'/questions/'+question.uid)
    ref.update({
      answers: firebase.firestore.FieldValue.arrayUnion(newAnswer) as any
    })

  }

}
