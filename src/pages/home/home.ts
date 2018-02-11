import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
//import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private backgroundGeolocation: BackgroundGeolocation, public platform: Platform, private device: Device) {
    //this.getLocationFore();
    //this.getLocation();
  }


  public getLocationFore() {
    this.geolocation.getCurrentPosition().then((resp) => {
      //resp.coords.latitude;
      //resp.coords.longitude;
      //console.log("lat: " + resp.coords.latitude + " | long: " + resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log(data);
      //this.latitude = data.coords.latitude;
      //this.longitude = data.coords.longitude;
    });
  }

  public getLocation() {
    const device = this.platform;
    //console.log(device);
    if (device.is('cordova')) {
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true,
        stopOnTerminate: false,
      };
      this.backgroundGeolocation.configure(config)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);
          this.deviceCoords.accuracy = location.coords.accuracy;
          this.deviceCoords.altitude = location.coords.altitude;
          this.deviceCoords.altitudeAccuracy = location.coords.altitudeAccuracy;
          this.deviceCoords.heading = location.coords.heading;
          this.deviceCoords.latitude = location.coords.latitude;
          this.deviceCoords.longitude = location.coords.longitude;
          this.deviceCoords.speed = location.coords.speed;
          this.deviceCoords.time = location.time;
          this.deviceCoords.timestamp = location.timestamp;
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          this.backgroundGeolocation.finish();
        });
    }
    // start recording location
    //this.backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();    
  }

  public getCoords() {
    this.backgroundGeolocation.start();
  }

  public getInfo() {
    const device = this.platform;
    if (device.is('cordova')) {
      this.deviceInfo.id = this.device.uuid;
      this.deviceInfo.model = this.device.model;
      this.deviceInfo.cordova = this.device.cordova;
      this.deviceInfo.platform = this.device.platform;
      this.deviceInfo.version = this.device.version;
      this.deviceInfo.manufacturer = this.device.manufacturer;
      this.deviceInfo.serial = this.device.serial;
      this.deviceInfo.isVirtual = this.device.isVirtual;
    }
  }
}
