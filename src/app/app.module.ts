import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicStorageModule } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { AppInformationProvider } from '../providers/app-information/app-information';
import { LocalNotificationProvider } from '../providers/local-notification/local-notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HttpModule } from '@angular/http';
import { ResourceTextProvider } from '../providers/resource-text/resource-text';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['websql', 'localstorage', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BackgroundGeolocation,
    Device,
    BackgroundMode,
    ResourceTextProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppVersion,
    LocationTrackerProvider,
    AppInformationProvider,
    LocalNotificationProvider,
    LocalNotifications,

  ]
})
export class AppModule { }
