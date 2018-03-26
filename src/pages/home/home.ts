import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AlertController } from 'ionic-angular';
import { ResourceTextProvider } from '../../providers/resource-text/resource-text';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, public resource: ResourceTextProvider) {
  }

  start() {
    console.log("start()");
    this.locationTracker.startTracking();
  }

  break() {
    console.log("break()");
    this.locationTracker.breakTracking();
  }

  stop() {
    console.log("stop()");
    this.locationTracker.stopTracking();
  }
}
