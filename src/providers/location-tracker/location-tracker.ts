import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Platform } from 'ionic-angular';
import { ResourceTextProvider } from '../../providers/resource-text/resource-text';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { Http, Headers } from '@angular/http';
import { LocalNotificationProvider } from '../../providers/local-notification/local-notification';

/*
The JSON keys we are using are location, time, imei and status
The URL and the body where the location should be sent to is:
POST http://work.simplicityengine.net:8086/location
Example keys and data
"time": "1502711997",
"imei": "353413088320170",
"latitude": "40.78",
"longitude": "-73.97"
"status": "working"
All possible statuses:
"status": "working"
"status": "on break"
"status": "end of day"
*/

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

@Injectable()
export class LocationTrackerProvider {
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public googleMapsUrl: string;
  public buttonClicked: boolean = false;
  public position: any;

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
  public dataLogs: any = {};
  public loc: any;
  public vloc: any;
  private toolbarColor: string;

  constructor(public zone: NgZone, public geolocation: Geolocation, public backgroundMode: BackgroundMode, public backgroundGeolocation: BackgroundGeolocation, public platform: Platform, public resource: ResourceTextProvider, private storage: Storage, private device: Device, public http: Http, public localNotification: LocalNotificationProvider) {
    console.log('Hello LocationTrackerProvider Provider');

    this.data.response = '';
    this.dataLogs.response = '';
    this.http = http;

    platform.ready().then(() => {
      console.log("platform.ready()" + platform.version());
      console.log("ionViewDidLoad");
      //this.backgroundMode.enable();
      this.getStatusFromStorage();
      this.getDeviceInfo();
      this.resource;
    });
  }

  /*startTracking() {
    // Foreground Tracking
    this.buttonClicked = !this.buttonClicked;
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.position = position;
        //console.log("this.zone.run");
        //console.log("this.lat: " + this.lat + " | this.lng: " + this.lng);
        this.geolocation.getCurrentPosition().then((resp) => {
          this.lat2 = resp.coords.latitude;
          this.lng2 = resp.coords.longitude;
          console.log("this.lat2: " + resp.coords.latitude);
          console.log("this.lng2: " + resp.coords.longitude);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      });

      this.backgroundMode.enable();
      //console.log(this.backgroundMode.isActive());
      //console.log(this.backgroundMode.isEnabled());
    });
  }*/

  //   public startTracking() {
  // 
  //     let config: BackgroundGeolocationConfig = {
  //       stationaryRadius: 50,
  //       distanceFilter: 50,
  //       notificationTitle: 'Background tracking',
  //       notificationText: 'enabled',
  //       debug: true,
  //       startOnBoot: false,
  //       stopOnTerminate: false,
  //       interval: this.resource.config.intervalTime,
  //       fastestInterval: 5000,
  //       activitiesInterval: 10000,
  //       url: 'http://luczynski.eu/api/api.php',
  //       desiredAccuracy: 0,
  //     };
  //     this.backgroundGeolocation.configure(config).subscribe((location) => {
  // 
  //       console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
  // 
  //       // Update inside of Angular's zone
  //       this.zone.run(() => {
  //         this.lat = location.latitude;
  //         this.lng = location.longitude;
  //       });
  //     }, (err) => {
  //       console.log(err);
  //     });
  // 
  //     this.backgroundGeolocation.start();
  // 
  //     // Background tracking
  //     let options = {
  //       frequency: 3000,
  //       enableHighAccuracy: true
  //     };
  // 
  //     this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
  //       console.log(position);
  // 
  //       this.zone.run(() => {
  //         console.log('BackgroundGeolocation2:  ' + position.coords.latitude + ',' + position.coords.longitude);
  //         this.lat = position.coords.latitude;
  //         this.lng = position.coords.longitude;
  //       });
  //     });
  //   }
  //   // 
  //   public stopTracking() {
  //     console.log('stopTracking');
  // 
  //     this.backgroundGeolocation.finish();
  //     this.watch.unsubscribe();
  //   }
  // 
  breakTracking() {
    console.log("break tracking...");
    console.log(this.resource.jobStatus.break);
    this.saveStatusToStorage(this.resource.jobStatus.break);
    this.getStatusFromStorage();

    console.log("this.setInterval przed clear");
    console.log(this.setInterval);
    clearInterval(this.setInterval);
    console.log("this.setInterval po clear");
    console.log(this.setInterval);
    console.log(this.backgroundMode.isActive());
    console.log(this.backgroundMode.isEnabled());
    //this.backgroundMode.disable();

    if (this.watch === undefined) {
      console.log("nothing to do...");
    } else {
      this.watch.unsubscribe();
    }
  }

  /*stopTracking() {
    console.log("stop tracking...");
    this.buttonClicked = !this.buttonClicked;
    if (this.watch === undefined) {
      console.log("nothing to do...");
    } else {
      this.watch.unsubscribe();
    }
    console.log(this.backgroundMode.isActive());
    console.log(this.backgroundMode.isEnabled());
    //this.backgroundMode.disable();
  }*/

  startTracking() {
    console.log("startTracking()");
    console.log(this.resource.jobStatus.work);
    //this.saveStatusToStorage(this.resource.jobStatus.preparework);
    this.saveStatusToStorage(this.resource.jobStatus.work);
    this.getStatusFromStorage();
    // Background Tracking
    let config = {
      stationaryRadius: 50,
      distanceFilter: 500,
      desiredAccuracy: 10,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: false,
      interval: this.resource.config.intervalTime,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      maxLocations: 10000,
      url: this.resource.config.apiLinkTest,
      syncurl: this.resource.config.apiLinkTest,
      httpHeaders: {
        'X-FOO': 'bar'
      },
      // customize post properties
      postTemplate: {
        time: "1502711997",
        imei: "353413088320170",
        latitude: "40.78",
        longitude: "-73.97",
        status: "working"
      },
    };

    console.log("startTracking()");

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      if (this.platform.is('ios')) {
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      }

      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };

      this.backgroundGeolocation.deleteAllLocations();
      this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

        // Run update inside of Angular's zone
        this.zone.run(() => {
          //this.setInterval = setInterval(data => {
          this.lat = location.latitude;
          this.lng = location.longitude;
          console.log("this.lat: " + this.lat + " | this.lng: " + this.lng);


          /*console.log("this.backgroundGeolocation.isLocationEnabled()");
          this.backgroundGeolocation.isLocationEnabled();
          console.log("this.backgroundGeolocation.showAppSettings()");
          //this.backgroundGeolocation.showAppSettings();
          console.log("this.backgroundGeolocation.showLocationSettings()");
          //this.backgroundGeolocation.showLocationSettings();
          console.log("this.backgroundGeolocation.getLocations()");
          console.log(this.backgroundGeolocation.getLocations());
          console.log("this.backgroundGeolocation.getValidLocations()");
          this.backgroundGeolocation.getValidLocations();
          console.log("this.backgroundGeolocation.getLogEntries(0)");
          this.backgroundGeolocation.getLogEntries(0);*/

          this.backgroundGeolocation.getLocations().then(location => {
            this.loc = location;
            console.log("getLocations() - location");
            console.log(location);
          });
          this.backgroundGeolocation.getValidLocations().then(validLocation => {
            this.vloc = validLocation;
            console.log("getValidLocations() - validLocation");
            console.log(validLocation);
          });

          //this.saveCoords(this.resource.jobStatus.work, this.lat, this.lng);
          //this.saveCoordsLogs(this.resource.jobStatus.work, this.lat, this.lng);
          //this.saveStatusToStorage(this.resource.jobStatus.work);
          //this.getStatusFromStorage();
          //}, this.resource.config.intervalTime);
        });


      }, (err) => {

        console.log(err);

      });

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    // Foreground Tracking

    /*    let options = {
          frequency: 2000,
          enableHighAccuracy: true
        };
    
        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
    
          console.log(position);
    
          // Run update inside of Angular's zone
          this.zone.run(() => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.lat2 = position.coords.latitude;
            this.lng2 = position.coords.longitude;
          });
    
        });*/
    //console.log("enable background mode");
    this.backgroundMode.enable();
  }

  stopTracking() {
    console.log('stopTracking');
    console.log(this.resource.jobStatus.end);
    this.saveStatusToStorage(this.resource.jobStatus.end);
    this.getStatusFromStorage();
    //this.storage.remove("coords");
    //this.storage.remove("status");
    this.storage.clear();

    this.backgroundGeolocation.finish();
    this.backgroundGeolocation.stop();
    console.log("this.setInterval przed clear");
    console.log(this.setInterval);
    clearInterval(this.setInterval);
    console.log("this.setInterval po clear");
    console.log(this.setInterval);

    if (this.watch === undefined) {
      console.log("nothing to do...");
    } else {
      this.watch.unsubscribe();
    }
  }

  saveStatusToStorage(status) {
    console.log("saveStatusToStorage(status): " + status);
    this.storage.set("status", status);
  }

  getStatusFromStorage() {
    console.log("getStatusFromStorage()");
    this.storage.get('status').then((val) => {
      this.jobStatusDb = val;
      this.setButtonStatus(this.jobStatusDb);
      console.log("getStatusFromStorage(): " + this.jobStatusDb);
    });
  }

  saveCoords(status, lat, lng) {
    console.log("saveCoords()")
    this.unixTime = Date.now() / 1000 | 0;
    this.date = (new Date);
    console.log(this.storage.driver);

    /* create json object from functions to storage save */
    let jsonobj = { "date": this.date, "lat": lat, "long": lng, "status": status, "storage.driver": this.storage.driver, "bgmodeActive": this.backgroundMode.isActive(), "bgmodeIsEnabled": this.backgroundMode.isEnabled(), "time": this.unixTime, "imei": this.device.uuid };

    // add json object to storage database
    this.storage.set("coords", jsonobj);
    //this.storage.set("log-" + this.unixTime, jsonobj);
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

      if (val.lat != 0 && val.long != 0) {
        // send data to server
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.resource.config.apiLinkProd, myData, {
          headers: headers
        })
          .subscribe(data => {
            this.data.response = JSON.parse(data['_body']);

            console.log("this.data.response: " + this.data.response.status);
            console.log("val.imei: " + val.imei);
            console.log("this.unixTime: " + this.unixTime);
            console.log("this.date: " + this.date);
            console.log("this.unixtime2date: " + this.unixtime2date(this.unixTime));
            let access = (this.data.response.status === "SUCCESS");
            if (access) {
              // push notification with coords
              //this.localNotification.pushNotificationSuccess(val.lat, val.long);
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
  saveCoordsLogs(status, lat, lng) {
    console.log("saveCoords()")
    this.unixTime = Date.now() / 1000 | 0;
    this.date = (new Date);
    console.log(this.storage.driver);

    /* create json object from functions to storage save */
    let jsonobj = { "date": this.date, "lat": lat, "long": lng, "status": status, "storage.driver": this.storage.driver, "bgmodeActive": this.backgroundMode.isActive(), "bgmodeIsEnabled": this.backgroundMode.isEnabled(), "time": this.unixTime, "imei": this.device.uuid };

    var myDataLogs = JSON.stringify(jsonobj);

    if (jsonobj.lat != 0 && jsonobj.long != 0) {
      // send data to server
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.resource.config.apiLinkTest + "?imei=" + jsonobj.imei, myDataLogs, {
        headers: headers
      })
        .subscribe(data => {
          this.dataLogs.response = data['_body'];
          console.log(this.dataLogs.response);
        }, error => {
          console.log("error: " + JSON.stringify(error.json()));
        });
    }
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
