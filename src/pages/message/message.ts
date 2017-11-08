import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {DomSanitizer} from '@angular/platform-browser';
/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var XuntongJSBridge;

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers: [HttpServiceProvider]
})

export class MessagePage {

  messageForm: FormGroup;

  to: Array<{ id: string, display: string, type: number }> = [];

  cc: Array<{ id: string, display: string, type: number }> = [];

  is_send_disabled: boolean;

  subject: any;
  content: any;
  toPersons: any;
  ccPersons: any;

  receiveContent: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder,
              public changeDetectorRef: ChangeDetectorRef, public service: HttpServiceProvider, private sanitize: DomSanitizer) {
    this.messageForm = formBuilder.group({
      'subject': ['', Validators.compose([Validators.required])],
      'content': ['', Validators.compose([Validators.required])],
      'to': [],
      'cc': []
    });
    this.subject = this.messageForm.controls['subject'];
    this.content = this.messageForm.controls['content'];
    this.toPersons = this.messageForm.controls['to'];
    this.ccPersons = this.messageForm.controls['cc'];
    this.is_send_disabled = true;

    console.log(this.navParams.data);
  }

  ionViewDidLoad() {
    const {action, message} = this.navParams.data;
    console.log(message);
    if (action && action == 'reply') {
      let from = message['from'];
      this.to.push(...this.convertEmailAddress([from]));
      this.subject.setValue("Re:" + message['subject']);
      this.receiveContent = this.sanitize.bypassSecurityTrustHtml(message['html']);
    }
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
      console.log(addr);
      result.push({id: addr['email'], display: display});
    }
    return result;
  }

  send = () => {
    let {action, message, folder} = this.navParams.data, params = this.messageForm.value
    if (action && action == 'reply') {
      this.service.postJSON('/app/message/reply', {message: params, number: message['number'], folder: folder});
    } else if (!action) {
      this.service.postJSON('/app/message/send', params);
    }
  }

  onTagInputChange = (event) => {
    this.validateMessageForm();
  }

  validateMessageForm = () => {
    let validate = this.subject.hasError('required') ||
      this.content.hasError('required') ||
      !this.to || this.to.length == 0;
    if (validate) {
      this.is_send_disabled = true;
    } else {
      this.is_send_disabled = false;
    }
  }
  onAddToPersons = () => {
    let _self = this;
    XuntongJSBridge.call('selectPersons', {
      'isMulti': false,
      'isShowMe': true
    }, function (result) {
      let url = '/app/yuzhijia/email/get', params = {persons: result.data.persons};
      _self.service.postJSON(url, params).then(function (response) {
        if (response['success']) {
          let data = response['data'];
          for (let key in data) {
            let p = data[key], v = {id: p.email, display: p.email, type: 1};
            if (_self.verifyToTag(v)) {
              _self.to.push(v);
            }
          }
          _self.changeDetectorRef.detectChanges();
        }
      })
    });
  }
  onAddCcPersons = () => {
    let _self = this;
    XuntongJSBridge.call('selectPersons', {
      'isMulti': false,
      'isShowMe': true
    }, function (result) {
      let persons = result.data.persons;
      let url = '/app/yuzhijia/email/get', params = {persons: result.data.persons};
      _self.service.postJSON(url, params).then(function (response) {
        if (response['success']) {
          let data = response['data'];
          for (let key in data) {
            let p = data[key], v = {id: p.email, display: p.email, type: 1};
            if (_self.verifyCcTag(v)) {
              _self.cc.push(v);
            }
          }
          _self.changeDetectorRef.detectChanges();
        }
      })
    })
  }
  verifyToTag = (tag) => {
    if (!tag) {
      return false;
    }
    for (let key in this.to) {
      let $tag = this.to[key];
      if ($tag.id == tag.id) {
        return false;
      }
    }
    return true;
  }

  verifyCcTag = (tag) => {
    if (!tag) {
      return false;
    }
    for (let key in this.cc) {
      let $tag = this.cc[key];
      if ($tag.id == tag.id) {
        return false;
      }
    }
    return true;
  }

}
