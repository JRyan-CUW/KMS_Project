import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewChecked
} from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import * as firebase from "firebase/app";

import { ROUTE_ANIMATIONS_ELEMENTS } from "@app/core";

import { Feature, features } from "./features.data";
import { FirestoreService } from "../services/firestore.service";

declare let paypal: any;

@Component({
  selector: "fund-home",
  templateUrl: "./fund-home.component.html",
  styleUrls: ["./fund-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundHomeComponent implements AfterViewChecked {
  addScript: boolean = false;
  paypalLoad: boolean = true;

  finalAmount: number = 1;

  paypalConfig = {
    env: "sandbox",
    client: {
      sandbox:
        "AR5e_DapiVlBXgtr3FLImySiavsJV5URW-JMAK7xbely5zcM2nno6zb1ZZe9hakz5UgJbHNNnY9N6Z8e"
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: "USD" } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then(payment => {
        //Do something when payment is successful.
      });
    }
  };

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, "#paypal-button-container");
        this.paypalLoad = false;
      });
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement("script");
      scripttagElement.src = "https://www.paypalobjects.com/api/checkout.js";
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }
}
