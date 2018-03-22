import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/filter';
import { AppVersion } from '@ionic-native/app-version';

//import { Platform } from 'ionic-angular';
/*
  Generated class for the AppInformationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppInformationProvider {
  constructor(public zone: NgZone, public app: AppVersion) {
    console.log('Hello AppInformationProvider Provider');
    app.getVersionNumber().then(ver => {
      //this.app = ver;
      console.log(this.app)
    }).catch(function (error) {
      console.log(error);
    });
  }

  /*async getAppName() {
    const appName = await this.app.getAppName();
    console.log(appName);
  }
  async getPackageName() {
    const packageName = await this.app.getPackageName();
    console.log(packageName);
  }
  async getVersionNumber() {
    const versionNumber = await this.app.getVersionNumber();
    console.log(versionNumber);
  }
  async getVersionCode() {
    const versionCode = await this.app.getVersionCode();
    console.log(versionCode);
  }*/
}
