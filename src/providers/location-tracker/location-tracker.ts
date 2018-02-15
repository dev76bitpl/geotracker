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
  public watchGPS: any;
  public lat: number = 0;
  public lng: number = 0;
  constructor(public zone: NgZone, public geolocation: Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
  }

  startTracking() {
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
      });

    });
  }

  stopTracking() {
    console.log("stop tracking...")
    this.watch.unsubscribe();
  }

}
