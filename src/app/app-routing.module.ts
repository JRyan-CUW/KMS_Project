import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SettingsContainerComponent } from "./settings";
import { SchoolHomeComponent } from "./school-home/school-home.component";
import { FundHomeComponent } from "./fund-home/fund-home.component";
import { HomeComponent } from "./home/home.component";
import { SignInComponent } from "./sign-in/sign-in.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "settings",
    component: SettingsContainerComponent,
    data: { title: "anms.menu.settings" }
  },
  {
    path: "school-home",
    component: SchoolHomeComponent
  },
  {
    path: "fund-home",
    component: FundHomeComponent
  },
  {
    path: "sign-in",
    component: SignInComponent
  },
  {
    path: "about",
    component: SettingsContainerComponent,
    data: { title: "anms.menu.settings" }
  },
  {
    path: "**",
    redirectTo: "about"
  }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
