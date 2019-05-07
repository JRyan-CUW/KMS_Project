import { Component, OnInit, ChangeDetectionStrategy, Inject, Injectable } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import { Feature, features } from './features.data';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from  "@angular/fire/auth";
import { Observable } from 'rxjs';
// import * as firebase from 'firebase/app';
import { FirestoreService } from '@app/services/firestore.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { School } from '@app/models/school.model';
import { FundReference } from '@app/models/fundReference.model';
import { Fund } from '@app/models/fund.model';
import { FileUploader } from 'ng2-file-upload';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'school-home',
  templateUrl: './school-home.component.html',
  styleUrls: ['./school-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolHomeComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  funds: Array<Fund> = new Array<Fund>();
  selectedSchool: School = new School();
  tempSchool: School = new School();
  // user: Observable<firebase.User>;
  allSchools: Observable<any[]>;
  dbSchools = new Array<School>();
  createNewFund: Fund = new Fund();
  public schoolPic: string;
  router: Router;

  profileUrl: Promise<AngularFireStorageReference>;

  constructor(
    public firestoreService: FirestoreService,
    public dialog: MatDialog,
    private afStorage: AngularFireStorage,
    private route: ActivatedRoute,
    router: Router
    //public photoID: PhotoFireID,
  ) {
    this.router = router;
    // const downRef = this.afStorage.storage.ref('5k2yywecung');
    // downRef.getDownloadURL().then((downloadURL) => {
    //   this.schoolPic = downloadURL;
    //   console.log(this.schoolPic);
    // });
  }
 
  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.selectedSchool = JSON.parse(params['school']);
      // this.selectedSchool.name = params['name'];
      // this.selectedSchool.funds = JSON.parse(params['funds']);
      // this.selectedSchool.picFullLoc = params['pic'];
      // this.selectedSchool.docID = params['schoolDocID'];
      // this.selectedSchool = this.firestoreService.getCurrSchool();
      console.log(this.selectedSchool);
      
      console.log(this.selectedSchool.picFullLoc);

      this.funds = this.selectedSchool.funds;
      
    });

    // this.allSchools = this.firestoreService.getSchools().valueChanges()
    // this.allSchools.forEach(schoolsAR => {
    //   this.dbSchools = schoolsAR;
    //   this.dbSchools.forEach(school => {
    //     console.log(school.name == this.schoolRoute);
    //     if(school.name == this.schoolRoute){
    //       this.selectedSchool = school;
    //     }
    //   });
    //   console.log(this.selectedSchool);
    // });
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  createFund() {
    console.log(this.selectedSchool);
    const dialogRef = this.dialog.open(CreateFundDialogComponent, {
      width: '420px'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        this.createNewFund.name = result[0];
        this.createNewFund.department = result[1];
        this.createNewFund.goalAmount = Number(result[2]);
        this.createNewFund.description = result[3];
        this.createNewFund.picLoc = this.firestoreService.getPhotoID();
        this.createNewFund.picFullLoc = 'https://firebasestorage.googleapis.com/v0/b/klug-management-system.appspot.com/o/' + this.createNewFund.picLoc +'?alt=media&token=97d616b3-b72d-4657-9cc0-96d36cb8ce56'
        this.createNewFund.currentAmount = 0;
        this.createNewFund.value = Number(this.createNewFund.currentAmount)/Number(this.createNewFund.goalAmount) * 100;

        this.tempSchool = this.selectedSchool;
        this.tempSchool.funds.push(this.createNewFund);

        this.firestoreService.updateSchool(this.tempSchool.docID, JSON.parse(JSON.stringify(this.tempSchool)));
      }
    );
   }

   onClickFund(fund: Fund) {
    // this.firestoreService.setCurrFund(fund);
    this.router.navigate(['fund-home'], {queryParams: {fund: JSON.stringify(fund), school: JSON.stringify(this.selectedSchool)}});
    //this.router.navigate(['fund-home'], {queryParams: {fund: JSON.stringify(fund), name: fund.name, description: fund.description, currAmount: fund.currentAmount, goalAmount: fund.goalAmount, value: fund.value, picLoc: fund.picFullLoc, schoolDocID: this.selectedSchool.docID, schoolName: this.selectedSchool.name, schoolFunds: JSON.stringify(this.selectedSchool.funds), schoolPic: this.selectedSchool.picFullLoc}});
   }
}

@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html'
})
export class CreateFundDialogComponent {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  file: any;
  
  constructor(
    public dialogRef: MatDialogRef<CreateFundDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: String,
    public firestoreService: FirestoreService,
    private afStorage: AngularFireStorage) {
      
    }

  upload(event) {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }

  createFund() {
    const id = Math.random().toString(36).substring(2);
    this.firestoreService.setPhotoID(id);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(this.file);
  }
}
