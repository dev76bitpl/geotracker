import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Platform } from 'ionic-angular';

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
@Injectable()
export class LocationTrackerProvider {
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public lat2: number = 0;
  public lng2: number = 0;
  public googleMapsUrl: string;
  public buttonClicked: boolean = false;
  public position: any;
  public bmIsActive: boolean;
  public bmIsEnabled: boolean;

  constructor(public zone: NgZone, public geolocation: Geolocation, public backgroundMode: BackgroundMode, public backgroundGeolocation: BackgroundGeolocation, public platform: Platform) {
    console.log('Hello LocationTrackerProvider Provider');
    // cordova.plugins.backgroundMode is now available
    this.bmIsActive = backgroundMode.isActive();
    this.bmIsEnabled = backgroundMode.isEnabled();
    console.log(this.bmIsActive);
    console.log(this.bmIsEnabled);
  }

  startTracking() {
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
  }

  breakTracking() {
    console.log("break tracking...");
    if (this.watch === undefined) {
      console.log("nothing to do...");
    } else {
      this.watch.unsubscribe();
    }
    console.log(this.backgroundMode.isActive());
    console.log(this.backgroundMode.isEnabled());
    //this.backgroundMode.disable();
  }

  stopTracking() {
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
  }

  startTracking2() {
    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: false,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      if (this.platform.is('ios')) {
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      }

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.lat2 = location.latitude;
        this.lng2 = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
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

    });
    console.log("enable background mode");
    this.backgroundMode.enable();
  }

  stopTracking2() {
    console.log('stopTracking2');

    this.backgroundGeolocation.finish();
    this.backgroundGeolocation.stop();
    this.watch.unsubscribe();
  }

}
