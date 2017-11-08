import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
  providers: [HttpServiceProvider]
})
export class ConfigPage {
  @ViewChild(Navbar) navBar: Navbar

  tab: string = "IMAP";
  configForm: FormGroup;
  imap_host: any;
  imap_account: any;
  imap_password: any;
  smtp_host: any;
  smtp_account: any;
  smtp_password: any;

  is_save_config_disabled: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public service: HttpServiceProvider) {

    this.configForm = formBuilder.group({
      'imap_host': ['', Validators.compose([Validators.required])],
      'imap_account': ['', Validators.compose([Validators.required])],
      'imap_password': ['', Validators.compose([Validators.required])],
      'smtp_host': ['', Validators.compose([Validators.required])],
      'smtp_account': ['', Validators.compose([Validators.required])],
      'smtp_password': ['', Validators.compose([Validators.required])]
    });
    this.imap_host = this.configForm.controls['imap_host'];
    this.imap_account = this.configForm.controls['imap_account'];
    this.imap_password = this.configForm.controls['imap_password'];
    this.smtp_host = this.configForm.controls['smtp_host'];
    this.smtp_account = this.configForm.controls['smtp_account'];
    this.smtp_password = this.configForm.controls['smtp_password'];
    this.is_save_config_disabled = true;
  }

  ionViewDidLoad() {
    let hidden = this.navParams.get('back_button_hidden');
    this.navBar.hideBackButton = hidden;
  }

  validateConfigForm() {
    let validate = this.imap_host.hasError('required') ||
      this.imap_account.hasError('required') ||
      this.imap_password.hasError('required') ||
      this.smtp_host.hasError('required') ||
      this.smtp_account.hasError('required') ||
      this.smtp_password.hasError('required');
    if (validate) {
      this.is_save_config_disabled = true;
    } else {
      this.is_save_config_disabled = false;
    }
  }

  saveConfig() {
    let _self = this, url = '/app/config/save', params = this.configForm.value
    this.service.postJSON(url, params).then(function (response) {
      if (response['success']) {
        _self.navCtrl.push('ListPage', {'back_button_hidden': true});
      }
    });
  }
}
