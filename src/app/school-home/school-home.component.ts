import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  Injectable
} from "@angular/core";

import { ROUTE_ANIMATIONS_ELEMENTS } from "@app/core";

import { Feature, features } from "./features.data";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
// import * as firebase from 'firebase/app';
import { FirestoreService } from "@app/services/firestore.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { School } from "@app/models/school.model";
import { FundReference } from "@app/models/fundReference.model";
import { Fund } from "@app/models/fund.model";
import { FileUploader } from "ng2-file-upload";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "@angular/fire/storage";

@Component({
  selector: "school-home",
  templateUrl: "./school-home.component.html",
  styleUrls: ["./school-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolHomeComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  features: Feature[] = features;
  school: School = new School();
  funds: FundReference[];
  // user: Observable<firebase.User>;
  items: Observable<any[]>;
  createNewFund: Fund = new Fund();

  profileUrl: Observable<string | null>;

  ngOnInit() {
    this.items = this.firestoreService.getSchools().valueChanges();
    this.items.forEach(item => {
      console.log(item);
    });
  }

  openLink(link: string) {
    window.open(link, "_blank");
  }

  constructor(
    public firestoreService: FirestoreService,
    public dialog: MatDialog,
    private afStorage: AngularFireStorage //public photoID: PhotoFireID,
  ) {
    const downRef = this.afStorage.ref("cedv4whk5xj");
    this.profileUrl = downRef.getDownloadURL();
  }

  createFund() {
    const dialogRef = this.dialog.open(CreateFundDialogComponent, {
      width: "420px"
    });
    dialogRef.afterClosed().subscribe(result => {
      this.createNewFund.name = result[0];
      this.createNewFund.department = result[1];
      this.createNewFund.goalAmount = result[2];
      this.createNewFund.description = result[3];
      this.createNewFund.picLoc = this.firestoreService.getPhotoID();
      this.createNewFund.currentAmount = 0;
      this.createNewFund.createdBy = "Jacob Ryan";
      this.createNewFund.donateCount = 0;

      this.firestoreService.createFund(
        JSON.parse(JSON.stringify(this.createNewFund))
      );
    });
  }
}

@Component({
  selector: "app-create-fund",
  templateUrl: "./create-fund.component.html"
})
export class CreateFundDialogComponent {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  file: any;

  constructor(
    public dialogRef: MatDialogRef<CreateFundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String,
    public firestoreService: FirestoreService,
    private afStorage: AngularFireStorage
  ) {}

  upload(event) {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }

  createFund() {
    const id = Math.random()
      .toString(36)
      .substring(2);
    this.firestoreService.setPhotoID(id);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(this.file);
  }
}
