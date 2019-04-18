import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

import { AuthService } from "../services/auth.service";
import { FirestoreService } from "../services/firestore.service";

import { User } from "../models/user.model";
import { School } from "../models/school.model";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { Fund } from "@app/models/fund.model";
import { List } from "lodash";
import { TemplateDefinitionBuilder } from "@angular/compiler/src/render3/view/template";

@Component({
  selector: "sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  logIn: boolean = true;
  selectUser: boolean = false;
  isSchoolSignUp: boolean = false;
  isUserSignUp: boolean = false;
  router: Router;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  file: any;
  fileFund: any;

  public logInEmail: string;
  public logInPassword: string;

  public schoolSignUpEmail: string;
  public schoolSignUpPassword: string;
  public schoolSignUpName: string;
  public schoolSignUpAddress: string;
  public schoolSignUpCity: string;
  public schoolSignUpState: string;
  public schoolSignUpPhoneNum: string;

  public fundSignUpName: string;
  public fundSignUpDescription: string;
  public fundSignUpGoal: number;
  public fundSignUpPicLoc: string;
  public fundSignUpDepartment: string;

  public areFunds: boolean = false;
  removable = true;
  funds: Array<Fund> = new Array<Fund>();

  public states: string[] = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];

  public userToSignUp: User;
  public schoolToSignUp: School = new School();

  constructor(
    private _formBuilder: FormBuilder,
    public authService: AuthService,
    public firestoreService: FirestoreService,
    private afStorage: AngularFireStorage,
    router: Router
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
  }

  onClickSignUp() {
    this.logIn = false;
    this.selectUser = true;
  }

  onClickSchoolAccount() {
    this.selectUser = false;
    this.isSchoolSignUp = true;
  }

  onClickUserAccount() {
    this.selectUser = false;
    this.isUserSignUp = true;
  }

  logInUser() {}

  signUpUser() {
    this.authService.signUp(this.logInEmail, this.logInPassword);
    this.userToSignUp.uid = this.authService.getUserUID();
  }

  upload(event) {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }

  uploadFund(event) {
    console.log(event.target.files[0]);
    this.fileFund = event.target.files[0];
  }

  submitAndAddAnother() {
    this.areFunds = true;
    const tempFund = new Fund();
    tempFund.name = this.fundSignUpName;
    tempFund.goalAmount = this.fundSignUpGoal;
    tempFund.description = this.fundSignUpDescription;
    tempFund.department = this.fundSignUpDepartment;
    tempFund.currentAmount = 0;
    this.funds.push(tempFund);

    this.fundSignUpName = "";
    this.fundSignUpGoal = 0;
    this.fundSignUpDescription = "";
    this.fundSignUpDepartment = "";
  }

  remove(fund: Fund): void {
    const index = this.funds.indexOf(fund);

    if (index >= 0) {
      this.funds.splice(index, 1);
    }
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() =>
      console.log("fired")
    );
  }

  signUpSchool() {
    this.schoolToSignUp.email = this.schoolSignUpEmail;
    this.schoolToSignUp.name = this.schoolSignUpName;
    this.schoolToSignUp.address = this.schoolSignUpAddress;
    this.schoolToSignUp.phone = this.schoolSignUpPhoneNum;
    this.schoolToSignUp.city = this.schoolSignUpCity;
    this.schoolToSignUp.state = this.schoolSignUpState;
    this.schoolToSignUp.funds = this.funds;
    const id = Math.random()
      .toString(36)
      .substring(2);
    this.ref = this.afStorage.ref(id);
    this.schoolToSignUp.picLoc = id;
    this.task = this.ref.put(this.file);

    this.authService.signUp(this.schoolSignUpEmail, this.schoolSignUpPassword);
    this.delay(1000).then(any => {
      console.log(this.authService.getUserUID());
      this.schoolToSignUp.userUID = this.authService.getUserUID();
      this.firestoreService.createSchools(
        JSON.parse(JSON.stringify(this.schoolToSignUp))
      );

      this.authService.signIn(
        this.schoolSignUpEmail,
        this.schoolSignUpPassword
      );
    });
    //this.router.navigate(['home']);
  }
}
