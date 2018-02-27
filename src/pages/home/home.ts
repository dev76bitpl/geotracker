import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AppInformationProvider } from '../../providers/app-information/app-information';
import { LocalNotificationProvider } from '../../providers/local-notification/local-notification';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';

interface deviceInterface {
  id?: string,
  model?: string,
  cordova?: string,
  platform?: string,
  version?: string,
  manufacturer?: string,
  serial?: string,
  isVirtual?: boolean,

};

interface appVersionInterface {
  appName?: any,
  packageName?: any,
  versionCode?: any,
  versionNumber?: any,
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public appTitle: any;
  public deviceInfo: deviceInterface = {};
  public appInfo: appVersionInterface = {};
  public jsonArray = {};
  public intervalTime: number = 20000;
  public intervalTimeInSec: number;
  public unixTime: any;
  public dateNow: Date = (new Date);
  public apilink = 'http://luczynski.eu/api/api.php';
  //public apilink = 'http://work.simplicityengine.net:8086/location';
  public buttonWorkingDisabled: boolean;
  public buttonBreakDisabled: boolean = false;
  public buttonEndDisabled: boolean = false;

  public jobStatus = {
    break: "on break",
    work: "working",
    end: "end of day",
    preparework: "prepare working"
  };
  public jobStatusDb: string;

  public setInterval: number;
  //public items: Array<any> = [];
  public items: {};
  public data: any = {};

  constructor(public navCtrl: NavController, private device: Device, private backgroundMode: BackgroundMode, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, private storage: Storage, public appInformation: AppInformationProvider, public localNotification: LocalNotificationProvider, public http: Http) {
    this.intervalTimeInSec = this.intervalTime / 1000;
    this.data.response = '';
    this.http = http;
    this.getStatusFromStorage();
  }

  saveStatusToStorage(status) {
    console.log("saveStatusToStorage(status): " + status);
    this.storage.set("status", status);
  }

  setButtonStatus(status) {
    switch (status) {
      case this.jobStatus.preparework:
        this.buttonWorkingDisabled = true;
        this.buttonEndDisabled = false;
        console.log("case 0: " + this.buttonWorkingDisabled);
        break;
      case this.jobStatus.work:
        this.buttonWorkingDisabled = true;
        this.buttonBreakDisabled = false;
        this.buttonEndDisabled = false;
        console.log("case 1: " + this.buttonWorkingDisabled);
        break;
      case this.jobStatus.break:
        this.buttonWorkingDisabled = false;
        this.buttonBreakDisabled = true;
        this.buttonEndDisabled = false;
        console.log("case 2: " + this.buttonWorkingDisabled);
        break;
      case this.jobStatus.end:
        this.buttonWorkingDisabled = false;
        this.buttonEndDisabled = true;
        this.buttonBreakDisabled = true;
        console.log("case 3: " + this.buttonWorkingDisabled);
        break;
      default:
        this.buttonWorkingDisabled = false;
        console.log("case 0: " + this.buttonWorkingDisabled);
    }
  }

  getStatusFromStorage() {
    this.storage.get('status').then((val) => {
      this.jobStatusDb = val;
      this.setButtonStatus(this.jobStatusDb);
      console.log("getStatusFromStorage(): " + this.jobStatusDb);
    });

  }
  start() {
    console.log(this.jobStatus.work);
    this.saveStatusToStorage(this.jobStatus.preparework);
    this.getStatusFromStorage();
    this.locationTracker.startTracking();
    this.setInterval = setInterval(data => {
      this.saveCoords(this.jobStatus.work);
      this.saveStatusToStorage(this.jobStatus.work);
      this.getStatusFromStorage();
    }, this.intervalTime);
  }

  break() {
    console.log(this.jobStatus.break);
    this.saveStatusToStorage(this.jobStatus.break);
    this.getStatusFromStorage();
    this.locationTracker.breakTracking();
    clearInterval(this.setInterval);
    this.saveCoords(this.jobStatus.break);
  }

  stop() {
    console.log(this.jobStatus.end);
    this.saveStatusToStorage(this.jobStatus.end);
    this.getStatusFromStorage();
    this.locationTracker.stopTracking();
    clearInterval(this.setInterval);
    this.saveCoords(this.jobStatus.end);
    this.storage.remove("coords");
    this.storage.remove("status");
    //this.storage.clear();
  }

  saveCoords(status) {
    console.log("saveCoords()")
    this.unixTime = (new Date).getTime();
    console.log(this.storage.driver);

    /* create json object from functions to storage save */
    let jsonobj = { "storage.driver": this.storage.driver, "bgmodeActive": this.backgroundMode.isActive(), "bgmodeIsEnabled": this.backgroundMode.isEnabled(), "lat": this.locationTracker.lat, "long": this.locationTracker.lng, "date": this.dateNow, "time": this.unixTime, "status": status, "imei": this.device.uuid };

    // add json object to storage database
    this.storage.set("coords", jsonobj);
    //this.storage.set(this.unixTime, jsonobj);
    console.log("jsonobj.lat: " + jsonobj.lat);
    console.log("jsonobj.long: " + jsonobj.long);
    // get data from storage for http post to server
    this.storage.get('coords').then((val) => {
      this.items = val;

      var myData = JSON.stringify({
        time: val.time,
        imei: val.imei,
        latitude: val.lat,
        longitude: val.long,
        status: val.status
      });

      //if (val.lat > 0 && val.long > 0 && val.imei != null) {
      // send data to server
      var headers = new Headers();
      //headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Content-Type', 'application/json');
      this.http.post(this.apilink, myData, {
        headers: headers
      })
        .subscribe(data => {
          //Api prod
          //this.data.response = JSON.parse(data['_body']);
          //api test
          this.data.response = data['_body'];
          console.log("this.data.response: " + this.data.response.status);
          // push notification with coords
          this.localNotification.pushNotification(jsonobj.lat, jsonobj.long);
          //let access = (this.data.response.success === true);
        }, error => {
          console.log("error: " + JSON.stringify(error.json()));
        });
    });

    /*this.storage.forEach((value, key, index) => {
      console.log(value.lat);
      this.items = value;
    })*/
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    this.appTitle = this.appInformation.appTitle;
    this.backgroundMode.enable();
    this.getAppInfo();
    this.getDeviceInfo();
    console.log(this.backgroundMode.isActive());
    console.log(this.backgroundMode.isEnabled());

  }

  public getAppInfo() {
    this.appInfo.appName = this.appInformation.app.getAppName();
    this.appInfo.packageName = this.appInformation.app.getPackageName();
    this.appInfo.versionCode = this.appInformation.app.getVersionCode();
    this.appInfo.versionNumber = this.appInformation.app.getVersionNumber();
  }
  public getDeviceInfo() {
    this.deviceInfo.id = this.device.uuid;
    this.deviceInfo.model = this.device.model;
    this.deviceInfo.cordova = this.device.cordova;
    this.deviceInfo.platform = this.device.platform;
    this.deviceInfo.version = this.device.version;
    this.deviceInfo.manufacturer = this.device.manufacturer;
    this.deviceInfo.serial = this.device.serial;
    this.deviceInfo.isVirtual = this.device.isVirtual;
    console.log("this.deviceInfo");
    console.log(this.deviceInfo);
  }
}
