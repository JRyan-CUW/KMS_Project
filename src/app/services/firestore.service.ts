import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Fund } from '@app/models/fund.model';
import { School } from '@app/models/school.model';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable()
export class FirestoreService {
    private photoID: string;

    private currSchool: School = new School();
    private currFund: Fund = new Fund();
    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

    getPhotoID() {
        return this.photoID;
    }
    setPhotoID(photoID: string) {
        this.photoID = photoID;
    }

    getCurrSchool() {
        return this.currSchool;
    }
    setCurrSchool(school: School) {
        this.currSchool = school;
    }

    getCurrFund() {
        return this.currFund;
    }
    setCurrFund(fund: Fund) {
        this.currFund = fund;
    }

    //Get All
    getSchools() {
        return this.firestore.collection('schools');
    }
    getUsers() {
        return this.firestore.collection('users');
    }

    //Get by School
    getSchoolFunds() {
        return "";
    }

    //Get One
    getOneSchool(documentId: string) {
        return this.firestore.collection('schools').doc(documentId);
    }
    getOneFund(documentId: string) {
        return this.firestore.collection('funds').doc(documentId);
    }

    //Creating
    createSchools(school: School)
    {
        const id = Math.random().toString(36).substring(2);
        //this.firestore.createId()
        school.docID = id;
        this.firestore.collection('schools').doc(id).set(school).catch(
            error => {
                console.log(error);
            }
        );
    }

    createFund(fund: Fund)
    {
        this.firestore.collection('funds').add(fund).catch(
            error => {
                console.log(error);
            }
        );
    }

    //Deleting
    deleteSchool(documentId: string)
    {
        this.firestore.collection('schools').doc(documentId).delete().catch(
            error => {
                console.log(error);
            }
        );
    }
    deleteFund(documentId: string)
    {
        this.firestore.collection('funds').doc(documentId).delete().catch(
            error => {
                console.log(error);
            }
        );
    }

    //Updating
    updateSchool(documentId: string, data: School)
    {
        this.firestore.collection('schools').doc(documentId).update(data);
    }
    updateFund(documentId: string, data: School)
    {
        this.firestore.collection('funds').doc(documentId).update(data);
    }
}