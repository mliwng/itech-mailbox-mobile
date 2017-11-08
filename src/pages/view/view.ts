import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
/**
 * Generated class for the ViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {

  receiveContent: any;

  subject: string;

  from: string;

  to: string;

  cc: string;

  sendDate: string;

  detailsHidden: any = true;

  message: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private sanitize: DomSanitizer) {
    this.message = {
      number: 37,
      subject: 'subject',
      from: {personal: 'yuqing_chi', email: 'yuqing_chi@aliyun.com'},
      to: {personal: 'yuqing_chi', email: 'yuqing_chi@aliyun.com'},
      sendDate: '2017-11-11',
      html: '<button>ssssS</button>'
    }
    //let {message} = this.navParams.data;
  }

  onMoreClick = () => {
    this.detailsHidden = !this.detailsHidden;
  }

  ionViewDidLoad() {

    this.subject = this.message['subject'];
    this.from = this.convertEmailAddress([this.message['from']]).join();
    console.log(this.from);
    this.to = this.convertEmailAddress(this.message['to']).join();
    this.cc = this.convertEmailAddress(this.message['cc']).join();
    this.sendDate = this.message['sendDate'];
    this.receiveContent = this.sanitize.bypassSecurityTrustHtml(this.message['html']);
  }

  onActionMoreClick = () => {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '红旗',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: '移动',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: '删除',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  onActionReplyForwardClick = () => {

    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '回复',
          handler: this.actionReply
        },
        {
          text: '回复全部',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: '转发',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  actionReply = () => {
    // this.navCtrl.push("MessagePage", {message: this.message, action: 'reply', folder: this.navParams.get('folder')});
    this.navCtrl.push("MessagePage", {message: this.message, action: 'reply', folder: 1});
  }

  convertEmailAddress = (addresses) => {
    let result = [];
    for (let key in addresses) {
      let display, addr = addresses[key];

      if (addr['personal']) {
        display = addr['personal'];
      } else {
        display = addr['email'];
      }
      result.push(display);
    }
    return result;
  }
}
