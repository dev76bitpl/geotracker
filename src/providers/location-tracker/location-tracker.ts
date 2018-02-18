import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public googleMapsUrl: string;
  public buttonClicked: boolean = false;
  public position: any;

  constructor(public zone: NgZone, public geolocation: Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
    this.googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=";
  }

  onLoadTracking() {
    // Foreground Tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.position = position;
      });

    });
  }

  startTracking() {
    // Foreground Tracking
    this.buttonClicked = !this.buttonClicked;
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.position = position;
      });

    });
  }

  stopTracking() {
    console.log("stop tracking...");
    this.buttonClicked = !this.buttonClicked;
    this.watch.unsubscribe();
    this.lat = 0;
    this.lng = 0;
  }

  startTracking2() {
    this.buttonClicked = !this.buttonClicked;
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log(resp);
      console.log("location-tracker lat: " + resp.coords.latitude);
      console.log("location-tracker lng: " + resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  startTracking3() {
    this.buttonClicked = !this.buttonClicked;
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log(data);
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
    });
  }

}
