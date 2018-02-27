import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/filter';
/*
  Generated class for the ResourceTextProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResourceTextProvider {

  public config = {
    appversion: 0.6,
    intervalTime: 20000,
    apiLinkProd: 'http://work.simplicityengine.net:8086/location',
    apiLinkTest: 'http://luczynski.eu/api/api.php',

  }

  public values = {
    title: "Job Tracking v " + this.config.appversion,
    startWork: "Push to start work",
    stopWork: "Push to stop work",
    breakWorkOn: "Click to go on break",
    breakWorkOff: "Click to restart work",
    ledStart: "Working",
    ledBreak: "On break",
    ledStop: "Stopped",
  }

  public jobStatus = {
    break: "on break",
    work: "working",
    end: "end of day",
    preparework: "prepare working"
  };

  constructor(public zone: NgZone) {
    console.log('Hello ResourceTextProvider Provider');
  }

}
