import { Injectable, NgZone } from "@angular/core";
import { User } from "../models/user.model";
import { UserSchool } from "../models/userSchool.model";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { FirestoreService } from "./firestore.service";

@Injectable()
export class AuthService {
  userData: any; // Save logged in user data
  private userUID: string;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public fsService: FirestoreService
  ) {
    /* Saving user data in localstorage when 
        logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  // Sign in with email/password
  signIn(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(["home"]);
        });
        this.setUserData(result.user);
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  getUserUID() {
    return this.userUID;
  }
  setUserUID(uid: string) {
    this.userUID = uid;
  }

  // Sign up with email/password
  signUp(email, password) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign 
                up and returns promise */
        //this.sendVerificationMail();
        console.log(result.user.uid);
        this.setUserUID(result.user.uid);
        console.log(this.getUserUID());
        //this.setUserData(result.user);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  // sendVerificationMail() {
  //     return this.afAuth.auth.currentUser.sendEmailVerification()
  //         .then(() => {
  //             this.router.navigate(['verify-email-address']);
  //         });
  // }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch(error => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign in with Google
  //   GoogleAuth() {
  //     return this.authLogin(new auth.GoogleAuthProvider());
  //   }

  // Auth logic to run auth providers
  // authLogin(provider) {
  //     return this.afAuth.auth.signInWithPopup(provider)
  //         .then((result) => {
  //             this.ngZone.run(() => {
  //                 this.router.navigate(['dashboard']);
  //             })
  //             this.setUserData(result.user);
  //         }).catch((error) => {
  //             window.alert(error)
  //         });
  // }

  /* Setting up user data when sign in with username/password, 
    sign up with username/password and sign in with social auth  
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      name: user.name
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // setUserSchoolData(userSchool) {
  //     const userSchoolRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userSchool.uid}`);
  //     const userSchoolData: UserSchool = {
  //         uid: userSchool.uid,
  //         email: userSchool.email,
  //         schoolName: userSchool.schoolName,
  //         photoUrl: userSchool.photoUrl,
  //         emailVerified: userSchool.emailVerified
  //     }
  //     return userSchoolRef.set(userSchoolData, {
  //         merge: true
  //     });
  // }

  // Sign out
  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["sign-in"]);
    });
  }
}
