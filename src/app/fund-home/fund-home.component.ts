import { Component, OnInit, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import { Feature, features } from './features.data';
import { FirestoreService } from '../services/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Fund } from '@app/models/fund.model';
import { School } from '@app/models/school.model';

declare let paypal: any;

@Component({
  selector: 'fund-home',
  templateUrl: './fund-home.component.html',
  styleUrls: ['./fund-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundHomeComponent implements AfterViewChecked, OnInit {
  addScript: boolean = false;
  paypalLoad: boolean = true;

  paymentAmount: number;
  currAmount: number;
  value: number;
  goal: number;
  selectedFund: Fund = new Fund();
  originalSchool: School = new School();
  router: Router;

  updateSchoolAfterPayment: School = new School();
  getSchool: Observable<any>;

  constructor(
    public firestoreService: FirestoreService,
    private route: ActivatedRoute,
    router: Router
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedFund = JSON.parse(params['fund']);
      this.currAmount = Number(this.selectedFund.currentAmount);
      this.value = Number(this.selectedFund.value);
      this.goal = Number(this.selectedFund.goalAmount);
      this.originalSchool = JSON.parse(params['school']);
      // this.selectedFund.name = params['name'];
      // this.selectedFund.description = params['description'];
      // this.selectedFund.currentAmount = Number(params['currAmount']);
      // this.currAmount = this.selectedFund.currentAmount;
      // this.selectedFund.goalAmount = Number(params['goalAmount']);
      // this.selectedFund.value = Number(params['value']);
      // this.value = this.selectedFund.value
      // this.selectedFund.picFullLoc = params['picLoc'];
      // this.originalSchool.name = params['schoolName'];
      // this.originalSchool.funds = JSON.parse(params['schoolFunds']);
      // this.originalSchool.picFullLoc = params['schoolPic'];
      // this.originalSchool.docID = params['schoolDocID'];
    });
  }

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AR5e_DapiVlBXgtr3FLImySiavsJV5URW-JMAK7xbely5zcM2nno6zb1ZZe9hakz5UgJbHNNnY9N6Z8e'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.paymentAmount, currency: 'USD' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        const newCurrAmount = Number(this.currAmount) + Number(this.paymentAmount); 
        const newValue = newCurrAmount / this.goal * 100;
        console.log(this.originalSchool.docID);
        this.updateSchoolAfterPayment = this.originalSchool;
        this.updateSchoolAfterPayment.funds.forEach(fund => {
          if (fund.name == this.selectedFund.name) {
            console.log("entered if");
            
            fund.currentAmount = newCurrAmount
            fund.currentAmount = Number(fund.currentAmount);
            this.currAmount = fund.currentAmount;
            fund.value = newValue;
            this.value = fund.value;
          }
        });

        this.delay(1000).then(any => {
          console.log("entered update");
          this.firestoreService.updateSchool(this.originalSchool.docID, JSON.parse(JSON.stringify(this.updateSchoolAfterPayment)));
        });
        // this.getSchool = this.firestoreService.getOneSchool(this.originalSchool.docID).valueChanges();
        // this.getSchool.subscribe(school => {
        //   this.updateSchoolAfterPayment = school;

        //   console.log("fired before change values");
        //   console.log(this.updateSchoolAfterPayment);
        //   this.updateSchoolAfterPayment.funds.forEach(fund => {
        //     if(fund.name == this.selectedFund.name)
        //     {
        //       console.log("entered if");
        //       const newCurrAmount = this.currAmount + this.paymentAmount
        //       console.log(newCurrAmount);
        //       fund.currentAmount = newCurrAmount
        //       this.currAmount = fund.currentAmount;
        //       const newValue = newCurrAmount/this.selectedFund.goalAmount * 100;
        //       fund.value = newValue;
        //       this.value = fund.value;
        //     }
        //   });
        // });
      });
    }
  };

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-button-container');
        this.paypalLoad = false;
      })
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }

  onClickBackToSchool() {
    this.router.navigate(['school-home'], { queryParams: { school: JSON.stringify(this.originalSchool)}});
  }
}
