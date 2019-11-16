import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireFunctions } from '@angular/fire/functions';
import { Survey } from '../Models/survey';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { take } from 'rxjs/operators';
import { Question, OpenText, Choice, Answer } from '../Models/question';
import { Plan } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  public lastUserRating: number = 0

  constructor(private readonly afs: AngularFirestore, private fns: AngularFireFunctions) { }

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

  updateSurveyPlan(surveyUid: string, plan: Plan) {
    let ref = this.afs.doc<Survey>('surveys/'+surveyUid)
    ref.update({
      hostPlan: plan
    })
  }

  /* Create a new survey */
  createSurvey(survey) {
    survey.lastUserAddTimestamp = firebase.firestore.FieldValue.serverTimestamp()
    return new Promise<any>((resolve, reject) => {
      this.afs.doc<any>('surveys/'+survey.uid).set(Object.assign({}, survey))
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  /* Get surveys by User ID */
  getSurveysForUser(userId: string): Observable<Survey[]> {
    return this.afs.collection<Survey>('surveys', ref => ref.where('owner', '==', userId).orderBy('lastUserAddTimestamp','desc')).valueChanges()
  }

  addUserAttendee(survey: Survey, userId: string) {
    let ref = this.afs.doc<Survey>('surveys/'+survey.uid)
    ref.update({
      activeParticipants: firebase.firestore.FieldValue.arrayUnion(userId) as any,
      lastUserAddTimestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  removeUserAttendee(survey: Survey, userId: string) {
    let ref = this.afs.doc<Survey>('surveys/'+survey.uid)
    ref.update({
      activeParticipants: firebase.firestore.FieldValue.arrayRemove(userId) as any
    })
  }

  removeUserAttendeeOnDisconnect(survey: Survey, userId: string) {
    let ref = firebase.database().ref('/surveys/'+survey.uid+'/'+userId)
    ref.onDisconnect().cancel()
    ref.onDisconnect().set({
      rating: -this.lastUserRating
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

  /* Get a new short code and assign to survey */
  assignShortCode(survId) {
    this.fns.httpsCallable('addShortCode')({survId: survId}).toPromise()
      .then(res => {
        console.log({res})
      }, err => {
        console.log({err})
      }
    )}

  /* Get survey by short code */
  getSurveyWithShortcode(code: string): Observable<Survey[]> {
    console.log(code)
    return this.afs.collection<Survey>('surveys', ref => ref.where('shortCode', '==', code).limit(1)).valueChanges()
  }

}
