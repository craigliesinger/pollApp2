import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { first, switchMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userIsSignedIn: boolean;
  public userName: string;
  public user: Observable<User>;

  constructor(public afAuth: AngularFireAuth,private afs: AngularFirestore, private router: Router) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>('users/'+user.uid).valueChanges();
        } else {
          return EMPTY;
        }
      })
    )
   }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  } 

  getLoggedInUserId() {
    return this.afAuth.auth.currentUser.uid
  }

  /* Try to log the user in */
  async emailSignin(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.userIsSignedIn = true;
        this.userName = this.afAuth.auth.currentUser.displayName;
        this.updateUserData(res.user);
        resolve(res);
      }, err => reject(err))
    })
  }

  /* Log user out */
  logout() {
    return new Promise((resolve, reject) => {
      if(this.afAuth.auth.currentUser){
        this.afAuth.auth.signOut()
        this.userIsSignedIn = false;
        resolve();
      }
      else{
        reject();
      }
    });
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName,
    } 
    this.router.navigate(['/']);
    return userRef.set(data, { merge: true })
  }

  createUid() {
    return this.afs.createId()
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.userIsSignedIn = false;
    this.router.navigate(['/']);
  }

  registerUserWithEmail(value) {
    this.afAuth.auth.createUserWithEmailAndPassword(value.email,value.password)
      .then(userCredential => {
        value.uid = userCredential.user.uid
        this.updateUserData(value)
      })
  }

  resetPassword(userEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(userEmail)
  }

}
