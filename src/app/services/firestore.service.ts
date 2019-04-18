import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { Fund } from "@app/models/fund.model";
import { School } from "@app/models/school.model";

@Injectable()
export class FirestoreService {
  private photoID: string;

  constructor(private firestore: AngularFirestore) {}

  getPhotoID() {
    return this.photoID;
  }
  setPhotoID(photoID: string) {
    this.photoID = photoID;
  }

  //Get All
  getSchools() {
    return this.firestore.collection("schools");
  }
  getUsers() {
    return this.firestore.collection("users");
  }

  //Get by School
  getSchoolFunds() {
    return "";
  }

  //Get One
  getOneSchool(documentId: string) {
    return this.firestore.collection("schools").doc(documentId);
  }
  getOneFund(documentId: string) {
    return this.firestore.collection("funds").doc(documentId);
  }

  //Creating
  createSchools(school: School) {
    this.firestore
      .collection("schools")
      .add(school)
      .catch(error => {
        console.log(error);
      });
  }
  createFund(fund: Fund) {
    this.firestore
      .collection("funds")
      .add(fund)
      .catch(error => {
        console.log(error);
      });
  }

  //Deleting
  deleteSchool(documentId: string) {
    this.firestore
      .collection("schools")
      .doc(documentId)
      .delete()
      .catch(error => {
        console.log(error);
      });
  }
  deleteFund(documentId: string) {
    this.firestore
      .collection("funds")
      .doc(documentId)
      .delete()
      .catch(error => {
        console.log(error);
      });
  }

  //Updating
  updateSchool(documentId: string, data: School) {
    this.firestore
      .collection("schools")
      .doc(documentId)
      .update(data);
  }
  updateFund(documentId: string, data: School) {
    this.firestore
      .collection("funds")
      .doc(documentId)
      .update(data);
  }
}
