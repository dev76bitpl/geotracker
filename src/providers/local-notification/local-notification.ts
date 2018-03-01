import { Injectable, NgZone } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ResourceTextProvider } from '../../providers/resource-text/resource-text';

/*
  Generated class for the LocalNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalNotificationProvider {

  constructor(public zone: NgZone, private localNotifications: LocalNotifications, public resource: ResourceTextProvider) {
    console.log('Hello LocalNotificationProvider Provider');
  }
  pushNotificationSuccess(lat, long) {
    console.log('pushNotificationSuccess()');

    // Schedule delayed notification
    this.localNotifications.schedule({
      title: this.resource.values.notificationSuccessTitle,
      text: "lat: " + lat + " long: " + long,
      //at: new Date(new Date().getTime() + 3600),
      led: 'FF0000',
      sound: null
    });
  }

  pushNotificationFail() {
    console.log('pushNotificationFail()');
    // Schedule delayed notification
    this.localNotifications.schedule({
      title: this.resource.values.notificationFailTitle,
      text: this.resource.values.notificationFailText,
      //at: new Date(new Date().getTime() + 3600),
      led: 'FF0000',
      sound: null
    });
  }
}
