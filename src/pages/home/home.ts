import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

interface coordsInterface {
  accuracy?: number,
  altitude?: number,
  altitudeAccuracy?: number,
  heading?: number,
  latitude?: number,
  longitude?: number,
  speed?: number,
  time?: number,
  timestamp?: number,

};
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
  public latitude: any;
  public longitude: any;
  public deviceInfo: deviceInterface = {};
  public deviceCoords: coordsInterface = {};
  public intervalTime: number = 20000;

  constructor(public navCtrl: NavController, private device: Device, private backgroundMode: BackgroundMode, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, private sqlite: SQLite) {
    this.backgroundMode.enable();
    console.log(this.backgroundMode.isActive());
    console.log(this.backgroundMode.isEnabled());
    setInterval(data => {
      console.log("test");
    }, this.intervalTime);
  }


  start() {
    this.locationTracker.startTracking();
  }
  stop() {
    this.locationTracker.stopTracking();
  }

  start2() {
    this.locationTracker.startTracking2();
  }
  start3() {
    this.locationTracker.startTracking3();
  }

  saveCoords() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {


        db.executeSql('create table danceMoves(name VARCHAR(32))', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));


      })
      .catch(e => console.log(e));
  }
  //   public getLocationFore() {
  //     this.geolocation.getCurrentPosition().then((resp) => {
  // 
  //       /*this.deviceCoords.accuracy = location.coords.accuracy;
  //       this.deviceCoords.altitude = location.coords.altitude;
  //       this.deviceCoords.altitudeAccuracy = location.coords.altitudeAccuracy;
  //       this.deviceCoords.heading = location.coords.heading;
  //       this.deviceCoords.latitude = location.coords.latitude;
  //       this.deviceCoords.longitude = location.coords.longitude;
  //       this.deviceCoords.speed = location.coords.speed;
  //       this.deviceCoords.time = location.time;
  //       this.deviceCoords.timestamp = location.timestamp;*/
  // 
  //       this.deviceCoords.latitude = resp.coords.latitude;
  //       this.deviceCoords.longitude = resp.coords.longitude;
  // 
  //       resp.coords.latitude;
  //       resp.coords.longitude;
  //       console.log("lat: " + resp.coords.latitude + " | long: " + resp.coords.longitude);
  //     }).catch((error) => {
  //       console.log('Error getting location', error);
  //     });
  //     let watch = this.geolocation.watchPosition();
  //     watch.subscribe((data) => {
  //       console.log(data);
  //       //this.latitude = data.coords.latitude;
  //       //this.longitude = data.coords.longitude;
  //     });
  //   }

  public getInfo() {
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
    //}
  }
}
