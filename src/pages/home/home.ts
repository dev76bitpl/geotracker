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
    this.locationTracker.setInterval = setInterval(data => {
      this.locationTracker.saveCoordsLogs(this.resource.jobStatus.work, this.locationTracker.lat, this.locationTracker.lng);
      this.locationTracker.saveCoords(this.resource.jobStatus.work, this.locationTracker.lat, this.locationTracker.lng);
    }, this.resource.config.intervalTime);

    console.log("home lat: " + this.locationTracker.lat + "| home lng: " + this.locationTracker.lng);
  }

  break() {
    console.log("break()");
    this.locationTracker.breakTracking();
    console.log("break() - saveCoordsLogs()");
    this.locationTracker.saveCoordsLogs(this.resource.jobStatus.break, this.locationTracker.lat, this.locationTracker.lng);
    console.log("break() - saveCoords()");
    this.locationTracker.saveCoords(this.resource.jobStatus.break, this.locationTracker.lat, this.locationTracker.lng);
  }

  stop() {
    console.log("stop()");
    this.locationTracker.stopTracking();
    console.log("stop() - saveCoordsLogs()");
    this.locationTracker.saveCoordsLogs(this.resource.jobStatus.end, this.locationTracker.lat, this.locationTracker.lng);
    console.log("stop() - saveCoords()");
    this.locationTracker.saveCoords(this.resource.jobStatus.end, this.locationTracker.lat, this.locationTracker.lng);
  }
}
