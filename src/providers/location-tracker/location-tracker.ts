import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { BackgroundMode } from '@ionic-native/background-mode';

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
  public googleMapsUrl: string;
  public buttonClicked: boolean = false;
  public position: any;
  public bmIsActive: boolean;
  public bmIsEnabled: boolean;

  constructor(public zone: NgZone, public geolocation: Geolocation, private backgroundMode: BackgroundMode) {
    console.log('Hello LocationTrackerProvider Provider');
    // cordova.plugins.backgroundMode is now available
    //this.bmIsActive = backgroundMode.isActive();
    //this.bmIsEnabled = backgroundMode.isEnabled();
    //console.log(this.bmIsActive);
    //console.log(this.bmIsEnabled);
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
        console.log("this.zone.run");
        console.log("this.lat: " + this.lat + " | this.lng: " + this.lng);
      });
      this.backgroundMode.enable();
      console.log(this.bmIsActive);
      console.log(this.bmIsEnabled);
    });
  }

  breakTracking() {
    console.log("break tracking...");
    if (this.watch === undefined) {
      console.log("nothing to do...");
    } else {
      this.watch.unsubscribe();
    }
    console.log(this.bmIsActive);
    console.log(this.bmIsEnabled);
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
    console.log(this.bmIsActive);
    console.log(this.bmIsEnabled);
    //this.backgroundMode.disable();
  }
}
