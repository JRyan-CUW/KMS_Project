import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { CoreModule } from "@app/core";
import { SettingsModule } from "./settings";
import { FileUploadModule } from "ng2-file-upload";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import {
  SchoolHomeComponent,
  CreateFundDialogComponent
} from "./school-home/school-home.component";
import { FundHomeComponent } from "./fund-home/fund-home.component";
import { SignInComponent } from "./sign-in/sign-in.component";

import { FirebaseConfig } from "../environments/firebase.config";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import {
  AngularFireStorage,
  AngularFireStorageModule
} from "@angular/fire/storage";
import {
  AngularFirestore,
  AngularFirestoreModule
} from "@angular/fire/firestore";

import { AuthService } from "./services/auth.service";
import { FirestoreService } from "./services/firestore.service";

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";

@NgModule({
  exports: [],
  imports: [
    // materials
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,

    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,

    // features
    SettingsModule,

    // app
    AppRoutingModule,

    //firebase
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,

    //File Upload
    FileUploadModule
  ],
  declarations: [
    //Components
    AppComponent,
    HomeComponent,
    AboutComponent,
    SchoolHomeComponent,
    FundHomeComponent,
    SignInComponent,

    //Dialogs
    CreateFundDialogComponent
  ],
  entryComponents: [CreateFundDialogComponent],
  bootstrap: [AppComponent],
  providers: [
    AngularFirestore,
    AngularFireStorage,
    AuthService,
    FirestoreService
  ]
})
export class AppModule {}
