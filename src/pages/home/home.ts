import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Platform } from 'ionic-angular';
//import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  latitude: any;
  longitude: any;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private backgroundGeolocation: BackgroundGeolocation, public platform: Platform) {
    this.getLocationFore();
    this.getLocation();
  }


  private getLocationFore() {
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
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
    });
  }

  private getLocation() {
    const device = this.platform;
    console.log(device);
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
}
