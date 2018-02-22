import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AppInformationProvider } from '../../providers/app-information/app-information';
import { LocalNotificationProvider } from '../../providers/local-notification/local-notification';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  public dateNow: Date;
  public jobStatus = {
    break: "break",
    work: "work",
    end: "end",
  };
  public setInterval: number;
  //public items: Array<any> = [];
  public items: {};

  constructor(public navCtrl: NavController, private device: Device, private backgroundMode: BackgroundMode, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, private storage: Storage, public appInformation: AppInformationProvider, public localNotification: LocalNotificationProvider) {
    this.intervalTimeInSec = this.intervalTime / 1000;
  }


  start() {
    this.locationTracker.startTracking();
    this.saveCoords();
    this.setInterval = setInterval(data => {
      this.saveCoords();
    }, this.intervalTime);
  }
  stop() {
    this.locationTracker.stopTracking();
    clearInterval(this.setInterval);
    this.storage.clear();
  }

  start2() {
    this.locationTracker.startTracking2();
  }
  start3() {
    this.locationTracker.startTracking3();
  }

  saveCoords() {
    this.unixTime = (new Date).getTime();
    this.dateNow = (new Date);
    console.log(this.storage.driver);

    // set a key/value
    // location, time, imei, and status
    let jsonobj = { "storage.driver": this.storage.driver, "bgmodeActive": this.backgroundMode.isActive(), "bgmodeIsEnabled": this.backgroundMode.isEnabled(), "lat": this.locationTracker.lat, "long": this.locationTracker.lng, "date": this.dateNow, "time": this.unixTime, "status": this.jobStatus.work, "imei": this.device.uuid };

    // set a key/value
    this.storage.set("coords", jsonobj);
    this.storage.set(this.unixTime, jsonobj);
    console.log("jsonobj.lat: " + jsonobj.lat);
    console.log("jsonobj.long: " + jsonobj.long);
    // to get a key/value pair
    this.storage.get('coords').then((val) => {
      console.log(val.lat);
      this.items = val;
    });
    this.storage.get('coordinates').then((data) => {
      jsonobj = data;
      console.log(jsonobj)
    });
    this.localNotification.pushNotification(jsonobj.lat, jsonobj.long);
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
    //const device = this.platform;
    //if (device.is('cordova')) {
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
    //}
  }
}
