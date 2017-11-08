import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController} from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpServiceProvider]
})
export class HomePage {

  constructor(public navCtrl: NavController, public service: HttpServiceProvider) {
    let _self = this, url = '/app/config/isDone', params = {'back_button_hidden': true};
    this.service.postJSON(url, {}).then(function (response) {
      if (response['done']) {
        _self.navCtrl.push('ListPage', params);
      } else {
        _self.navCtrl.push('ConfigPage', params);
      }
    });
  }
}
