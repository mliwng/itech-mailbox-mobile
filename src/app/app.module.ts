import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {HttpServiceProvider} from '../providers/http-service/http-service';
import {HttpModule} from '@angular/http';
import {IonTagsInputModule} from "../components/ion-tags-input/ion-tags-input.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonTagsInputModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '后退'
    }),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServiceProvider
  ]
})
export class AppModule {
}
