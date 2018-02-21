import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppInformationProvider } from '../../providers/app-information/app-information';

interface appVersionInterface {
  appName?: any,
  packageName?: any,
  versionCode?: any,
  versionNumber?: any,
}

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public appInfo: appVersionInterface = {};

  constructor(public navCtrl: NavController, public appInformation: AppInformationProvider) {

  }

  ionViewDidLoad() {
    this.getAppInfo();
  }

  public getAppInfo() {
    this.appInfo.versionNumber = this.appInformation.app.getVersionNumber();
  }
}
