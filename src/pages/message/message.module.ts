import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MessagePage} from './message';
import {IonTagsInputModule} from "../../components/ion-tags-input/ion-tags-input.module";
@NgModule({
  declarations: [
    MessagePage,
  ],
  imports: [
    IonTagsInputModule,
    IonicPageModule.forChild(MessagePage),
  ], exports: [
    MessagePage
  ], entryComponents: [
    MessagePage
  ]
})
export class MessagePageModule {
}
