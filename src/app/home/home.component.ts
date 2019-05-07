import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { Router } from '@angular/router';
import { FirestoreService } from '@app/services/firestore.service';
import { School } from '@app/models/school.model';
import { Fund } from '../models/fund.model'
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  schoolCtrl: FormControl;
  dbSchools = new Array<School>();
  filteredSchools: Observable<any[]>;
  filteredStates: Array<School> = new Array<School>();
  clickedName: boolean;
  clickedLocation: boolean;
  showStateSchools: boolean = false;
  router: Router;
  allSchools: Observable<any[]>;
  public noSchoolsFound: boolean = false;
  public selectedState: string;
  public searchInput: string;
  public selectedRow: Number;
  public states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  constructor(private fb: FormBuilder, router: Router, public firestoreService: FirestoreService) {
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

    this.filteredSchools = this.schoolCtrl.valueChanges
      .pipe(
        startWith(''),
        map(school => school.length >=1 ? this.searchSchools(school): [])
      );
  }

  searchSchools(searchSchool: string) {
    return this.dbSchools.filter((s) => new RegExp(searchSchool, 'gi').test(s.name))
  }

  filterSchoolsName(name: string) {
    return this.allSchools.forEach(schoolAr => {
      schoolAr.filter(school => 
        school.name.toLowerCase().indexOf(name.toLowerCase()) == 0); 
    });
  }

  // filterSchoolsState(state: string) {
  //   return this.schools.filter(school =>
  //     school.state.toLowerCase().indexOf(state.toLowerCase()) == 0);
  // }

  onClickedName() {
    this.clickedName = true;
    this.clickedLocation = false;
    this.showStateSchools = false;
  }

  onClickedState() {
    this.clickedName = false;
    this.clickedLocation = true;
    this.showStateSchools = false;
  }

  highlightRow(index, state) {
    if(!this.noSchoolsFound) {
      this.selectedRow = index;
    }
    else {
      this.selectedRow = -1;
    }
  }

  onClickSearchName() {
    console.log(this.schoolCtrl.value)
    let tempSchool = new School();
    let fundAr = new Array<Fund>();
    this.dbSchools.forEach(school => {
      if(school.name == this.schoolCtrl.value) {
        console.log(school);
        tempSchool = school;
        school.funds.forEach(fund => {
          fundAr.push(fund);
        });
        tempSchool.funds = fundAr;
      }
    });
    this.router.navigate(['school-home'], {queryParams: {school: JSON.stringify(tempSchool)}});
    //this.router.navigate(['school-home'], {queryParams: {name: tempSchool.name, funds: JSON.stringify(tempSchool.funds), pic: tempSchool.picFullLoc, schoolDocID: tempSchool.docID}});
  }

  routeToSchoolHome(school: School) {
    this.router.navigate(['school-home'], {queryParams: {name: school.name, funds: JSON.stringify(school.funds), pic: school.picFullLoc, schoolDocID: school.docID}});
  }

  onClickSearchState() {
    this.noSchoolsFound = false;
    this.showStateSchools = true;

    console.log(this.selectedState);
    console.log(this.dbSchools);
    this.dbSchools.forEach(
      school => {
        if(school.state == this.selectedState) {
          this.filteredStates.push(school);
        }
      }
    );
    if(this.filteredStates.length == 0) {
      this.noSchoolsFound = true;
    }
  }
}
