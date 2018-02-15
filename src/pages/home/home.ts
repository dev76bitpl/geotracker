import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';


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

  constructor(public navCtrl: NavController, private geolocation: Geolocation, public platform: Platform, private device: Device, private backgroundMode: BackgroundMode, public locationTracker: LocationTrackerProvider) {
  }

  start() {
    this.backgroundMode.enable();
    console.log(this.backgroundMode.isActive());
    this.locationTracker.startTracking();
  }
  stop() {
    this.locationTracker.stopTracking();
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
