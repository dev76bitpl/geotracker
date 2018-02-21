import { Injectable, NgZone } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
/*
  Generated class for the LocalNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalNotificationProvider {

  constructor(public zone: NgZone, private localNotifications: LocalNotifications) {
    console.log('Hello LocalNotificationProvider Provider');
  }
  pushNotification(lat, long) {
    console.log('ionViewDidLoad About2');

    // Schedule delayed notification
    this.localNotifications.schedule({
      title: 'Geotracker: Your current position',
      text: "lat: " + lat + " long: " + long,
      //at: new Date(new Date().getTime() + 3600),
      led: 'FF0000',
      sound: null
    });


  }
}
