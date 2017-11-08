import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams, Toolbar, ViewController } from 'ionic-angular';
import { HttpServiceProvider } from "../../providers/http-service/http-service";
/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  @ViewChild(Toolbar) toolbar: Toolbar

  folders: Array<any> = [];
  messages: Array<any> = [];
  selected_folder: any = -1;
  NUM_ROW = 20;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public service: HttpServiceProvider) {

  }

  ionViewDidLoad() {
    this.fetchFolders();
  }

  writeMail = () => {
    this.navCtrl.push('MessagePage');
  }

  navigateConfig = () => {
    this.navCtrl.push('ConfigPage');
  }

  openMessage = (number) => {
    let _self = this, url = '/app/message/get', params = { folder: this.selected_folder, number: number };
    this.service.postJSON(url, params).then(function (response) {
      _self.navCtrl.push("ViewPage", { message: response['message'], folder: _self.selected_folder });
    });
  }

  openFolder(folder) {
    let _self = this;
    this.selected_folder = folder;

    this.fetchMessages(this.selected_folder, 1, this.NUM_ROW, function (response) {
      _self.messages = response.messages;
    });
  }


  doInfinite(infiniteScroll) {
    let _self = this;
    if (_self.selected_folder == -1) {
      infiniteScroll.complete();
      return;
    }
    this.fetchMessages(this.selected_folder, _self.messages.length + 1, this.NUM_ROW, function (response) {
      _self.messages = [..._self.messages, ...response.messages];
      infiniteScroll.complete();
    });
  }

  doRefresh(refresher) {
    let _self = this;
    if (_self.selected_folder == -1) {
      refresher.complete();
      return;
    }
    this.fetchMessages(this.selected_folder, 1, this.NUM_ROW, function (response) {
      _self.messages = response.messages;
      refresher.complete();
    });
  }

  fetchFolders() {
    let _self = this, url = '/app/folder/list';
    let a = this.service.postJSON(url, {}).then(response => {
      let items = response['folders'];
      for (let key in items) {
        if (items[key].name == 'INBOX') {
          items[key].name = '收件箱';
        }
      }
      _self.folders = items;
    });
  }

  fetchMessages(folder, begin, count, fn) {
    let _self = this, url = '/app/message/list';
    let a = this.service.postJSON(url, {
      folder: folder,
      begin: begin,
      count: count
    }).then(response => {
      fn(response);
    });
  }

  getMessageStatusIcon(m) {
    console.log(m);
  }

  config() {
    this.navCtrl.push('ConfigPage');
  }
}
