import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/map";
import { ROUTE_ANIMATIONS_ELEMENTS } from "@app/core";
import { Router } from "@angular/router";
import { FirestoreService } from "@app/services/firestore.service";
import { School } from "@app/models/school.model";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  schoolCtrl: FormControl;
  dbSchools = new Array<School>();
  filteredSchools: Observable<any[]>;
  clickedName: boolean;
  clickedLocation: boolean;
  showStateSchools: boolean = false;
  router: Router;
  allSchools: Observable<any[]>;
  public searchInput: string;
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

  constructor(
    private fb: FormBuilder,
    router: Router,
    public firestoreService: FirestoreService
  ) {
    this.clickedName = true;
    this.clickedLocation = false;
    this.schoolCtrl = new FormControl();
    this.router = router;
  }

  ngOnInit() {
    this.allSchools = this.firestoreService.getSchools().valueChanges();
    this.allSchools.forEach(schoolsAR => {
      this.dbSchools = schoolsAR;
      console.log(schoolsAR);
      console.log(this.dbSchools);
    });

    this.filteredSchools = this.schoolCtrl.valueChanges.pipe(
      startWith(""),
      map(school => (school.length >= 1 ? this.searchSchools(school) : []))
    );
  }

  searchSchools(searchSchool: string) {
    return this.dbSchools.filter(s =>
      new RegExp(searchSchool, "gi").test(s.name)
    );
  }

  filterSchoolsName(name: string) {
    return this.allSchools.forEach(schoolAr => {
      schoolAr.filter(
        school => school.name.toLowerCase().indexOf(name.toLowerCase()) == 0
      );
    });
  }

  // filterSchoolsState(state: string) {
  //   return this.schools.filter(school =>
  //     school.state.toLowerCase().indexOf(state.toLowerCase()) == 0);
  // }

  onClickedName() {
    this.clickedName = true;
    this.clickedLocation = false;
  }

  onClickedState() {
    this.clickedName = false;
    this.clickedLocation = true;
  }

  onClickSearchName() {
    console.log(this.schoolCtrl.value);

    //this.router.navigate(['school-home']);
  }

  onClickSearchState() {
    this.showStateSchools = true;
  }
}
