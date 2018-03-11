import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AppInformationProvider } from '../../providers/app-information/app-information';
import { LocalNotificationProvider } from '../../providers/local-notification/local-notification';
import { ResourceTextProvider } from '../../providers/resource-text/resource-text';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { Platform } from 'ionic-angular';

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
  public intervalTimeInSec: number;
  public unixTime: any;
  public date: any;
  public dateNow: Date = (new Date);
  public buttonWorkingDisabled: boolean;
  public buttonBreakDisabled: boolean = false;
  public buttonEndDisabled: boolean = false;
  public jobStatusDb: string;
  public setInterval: number;
  public items: {};
  public data: any = {};
  private toolbarColor: string;

  constructor(public navCtrl: NavController, private device: Device, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, private storage: Storage, public appInformation: AppInformationProvider, public localNotification: LocalNotificationProvider, public http: Http, public resource: ResourceTextProvider, private platform: Platform) {
    this.intervalTimeInSec = this.resource.config.intervalTime / 1000;
    this.data.response = '';
    this.http = http;

    platform.ready().then(() => {
      console.log("platform.ready()" + platform.version());
      console.log("ionViewDidLoad");
      this.getStatusFromStorage();
      this.getAppInfo();
      this.getDeviceInfo();
      this.resource;
    });
  }

  saveStatusToStorage(status) {
    console.log("saveStatusToStorage(status): " + status);
    this.storage.set("status", status);
  }

  setButtonStatus(status) {
    switch (status) {
      case this.resource.jobStatus.preparework:
        this.buttonWorkingDisabled = true;
        this.buttonBreakDisabled = true;
        this.buttonEndDisabled = false;
        this.toolbarColor = 'warning';
        console.log("case 0: " + this.buttonWorkingDisabled);
        break;
      case this.resource.jobStatus.work:
        this.buttonWorkingDisabled = true;
        this.buttonBreakDisabled = false;
        this.buttonEndDisabled = false;
        this.toolbarColor = 'secondary';
        console.log("case 1: " + this.buttonWorkingDisabled);
        break;
      case this.resource.jobStatus.break:
        this.buttonWorkingDisabled = false;
        this.buttonBreakDisabled = true;
        this.buttonEndDisabled = false;
        this.toolbarColor = 'primary';
        console.log("case 2: " + this.buttonWorkingDisabled);
        break;
      case this.resource.jobStatus.end:
        this.buttonWorkingDisabled = false;
        this.buttonEndDisabled = true;
        this.buttonBreakDisabled = true;
        this.toolbarColor = 'danger';
        console.log("case 3: " + this.buttonWorkingDisabled);
        break;
      default:
        this.buttonWorkingDisabled = false;
        this.buttonBreakDisabled = true;
        this.buttonEndDisabled = true;
        console.log("case 0: " + this.buttonWorkingDisabled);
    }
  }

  getStatusFromStorage() {
    console.log("getStatusFromStorage() - start");
    this.storage.get('status').then((val) => {
      this.jobStatusDb = val;
      this.setButtonStatus(this.jobStatusDb);
      console.log("getStatusFromStorage(): " + this.jobStatusDb);
    });
    console.log("getStatusFromStorage() - stop");
  }
  start() {
    console.log("start()");
    console.log(this.resource.jobStatus.work);
    this.saveStatusToStorage(this.resource.jobStatus.preparework);
    this.getStatusFromStorage();
    this.locationTracker.startTracking();
    this.setInterval = setInterval(data => {
      //this.saveCoords(this.resource.jobStatus.work);
      this.saveCoordsTest(this.resource.jobStatus.work);
      this.saveStatusToStorage(this.resource.jobStatus.work);
      console.log("test przed this.getStatusFromStorage()");
      this.getStatusFromStorage();
    }, this.resource.config.intervalTime);
    //this.toolbarColor = 'secondary';
  }

  break() {
    console.log("break()");
    console.log(this.resource.jobStatus.break);
    this.saveStatusToStorage(this.resource.jobStatus.break);
    this.locationTracker.breakTracking();
    this.getStatusFromStorage();
    clearInterval(this.setInterval);
    //this.saveCoords(this.resource.jobStatus.break);
    this.saveCoordsTest(this.resource.jobStatus.break);
  }

  stop() {
    console.log("stop()");
    console.log(this.resource.jobStatus.end);
    this.saveStatusToStorage(this.resource.jobStatus.end);
    this.locationTracker.stopTracking();
    clearInterval(this.setInterval);
    this.getStatusFromStorage();
    //this.saveCoords(this.resource.jobStatus.end);
    this.saveCoordsTest(this.resource.jobStatus.end);
    this.storage.remove("coords");
    this.storage.remove("status");
    //this.storage.clear();
  }


  saveCoordsTest(status) {
    console.log("saveCoords()")
    this.unixTime = Date.now() / 1000 | 0;
    this.date = (new Date);
    console.log(this.storage.driver);

    /* create json object from functions to storage save */
    let jsonobj = { "date": (new Date), "lat": this.locationTracker.lat, "long": this.locationTracker.lng, "status": status, "storage.driver": this.storage.driver, "bgmodeActive": this.locationTracker.bmIsActive, "bgmodeIsEnabled": this.locationTracker.bmIsEnabled, "time": this.unixTime, "imei": this.device.uuid };

    // add json object to storage database
    this.storage.set("coords", jsonobj);
    //this.storage.set("log-" + this.unixTime, jsonobj);
    this.storage.get('coords').then((val) => {
      this.items = val;
    });
    var myData = JSON.stringify(jsonobj);

    if (jsonobj.lat > 0 && jsonobj.long > 0) {
      // send data to server
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      //headers.append('Content-Type', 'text/csv');
      this.http.post(this.resource.config.apiLinkTest + "?imei=" + jsonobj.imei, myData, {
        headers: headers
      })
        .subscribe(data => {
          this.data.response = data['_body'];
          console.log(this.data.response);
          this.localNotification.pushNotificationSuccess(jsonobj.lat, jsonobj.long);
          /*let access = (this.data.response.status === "SUCCESS");
          if (access) {
            // push notification with coords
            this.localNotification.pushNotificationSuccess(jsonobj.lat, jsonobj.long);
            console.log("success");
          } else {
            // dodac zapisywanie rekordu do bazy w celu pozniejszej wysylki
            this.storage.set("fail-" + this.unixTime, jsonobj);
            this.localNotification.pushNotificationFail();
            console.log("fail");
        }*/


        }, error => {
          console.log("error: " + JSON.stringify(error.json()));
        });
    }
  }

  submit() {
    console.log("submit()")
    this.unixTime = Date.now() / 1000 | 0;
    this.date = (new Date);
    console.log(this.storage.driver);

    /* create json object from functions to storage save */
    let jsonobj = { "date": (new Date), "lat": this.locationTracker.lat, "long": this.locationTracker.lng, "status": "working", "storage.driver": this.storage.driver, "bgmodeActive": this.locationTracker.bmIsActive, "bgmodeIsEnabled": this.locationTracker.bmIsEnabled, "time": this.unixTime, "imei": this.device.uuid };

    // add json object to storage database
    this.storage.set("coords", jsonobj);
    //this.storage.set("log-" + this.unixTime, jsonobj);
    this.storage.get('coords').then((val) => {
      this.items = val;
    });
    var myData = JSON.stringify(jsonobj);

    if (jsonobj.lat > 0 && jsonobj.long > 0) {
      // send data to server
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      //headers.append('Content-Type', 'text/csv');
      this.http.post(this.resource.config.apiLinkTest + "?imei=" + jsonobj.imei, myData, {
        headers: headers
      })
        .subscribe(data => {
          this.data.response = data['_body'];
          console.log(this.data.response);
          this.localNotification.pushNotificationSuccess(jsonobj.lat, jsonobj.long);
        }, error => {
          console.log("error: " + JSON.stringify(error.json()));
        });
    }
  }
  saveCoords(status) {
    console.log("saveCoords()")
    this.unixTime = Date.now() / 1000 | 0;
    this.date = (new Date);
    console.log(this.storage.driver);

    /* create json object from functions to storage save */
    let jsonobj = { "date": this.dateNow, "lat": this.locationTracker.lat, "long": this.locationTracker.lng, "status": status, "storage.driver": this.storage.driver, "bgmodeActive": this.locationTracker.bmIsActive, "bgmodeIsEnabled": this.locationTracker.bmIsEnabled, "time": this.unixTime, "imei": this.device.uuid };

    // add json object to storage database
    this.storage.set("coords", jsonobj);
    this.storage.set("log-" + this.unixTime, jsonobj);
    //console.log("jsonobj.lat: " + jsonobj.lat);
    //console.log("jsonobj.long: " + jsonobj.long);
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

      if (val.lat > 0 && val.long > 0) {
        // send data to server
        var headers = new Headers();
        //headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Content-Type', 'application/json');
        this.http.post(this.resource.config.apiLinkProd, myData, {
          headers: headers
        })
          .subscribe(data => {
            //Api prod
            this.data.response = JSON.parse(data['_body']);
            //api test
            //this.data.response = data['_body'];

            console.log("this.data.response: " + this.data.response.status);
            console.log("val.imei: " + val.imei);
            console.log("this.unixTime: " + this.unixTime);
            console.log("this.date: " + this.date);
            console.log("this.unixtime2date: " + this.unixtime2date(this.unixTime));
            let access = (this.data.response.status === "SUCCESS");
            if (access) {
              // push notification with coords
              this.localNotification.pushNotificationSuccess(val.lat, val.long);
              console.log("success");
            } else {
              // dodac zapisywanie rekordu do bazy w celu pozniejszej wysylki
              this.storage.set("fail-" + this.unixTime, jsonobj);
              this.localNotification.pushNotificationFail();
              console.log("fail");
            }
          }, error => {
            console.log("error: " + JSON.stringify(error.json()));
          });
      }
    });
    /*this.storage.forEach((value, key, index) => {
      console.log(value);
      this.items = value;
    })*/
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    this.getStatusFromStorage();
    this.getAppInfo();
    this.getDeviceInfo();
    this.resource;
  }
  ionViewWillEnter() {
    console.log('Runs when the page is about to enter and become the active page.');
  }
  onPageWillEnter() {
    console.log("you enter the view");
  }

  onPageWillLeave() {
    console.log("you leave the view");
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

  public round(n, k) {
    var factor = Math.pow(10, k + 1);
    n = Math.round(Math.round(n * factor) / 10);
    return n / (factor / 10);
  }

  public unixtime2date(unixtimestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unixtimestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }
}
