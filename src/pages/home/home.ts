import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AppInformationProvider } from '../../providers/app-information/app-information';
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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public deviceInfo: deviceInterface = {};
  public jsonArray = {};
  public intervalTime: number = 15000;
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

  constructor(public navCtrl: NavController, private device: Device, private backgroundMode: BackgroundMode, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, private storage: Storage, public appInformation: AppInformationProvider) {
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

    /*this.storage.forEach((value, key, index) => {
      console.log(value.lat);
      this.items = value;
    })*/
  }

  ionViewDidLoad() {
    this.backgroundMode.enable();
    this.getDeviceInfo();
    console.log(this.backgroundMode.isActive());
    console.log(this.backgroundMode.isEnabled());

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
    console.log(this.deviceInfo);
    //}
  }
}
