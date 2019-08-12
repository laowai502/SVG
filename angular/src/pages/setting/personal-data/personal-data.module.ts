import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalDataPage } from './personal-data';

@NgModule({
  declarations: [
    PersonalDataPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalDataPage),

  ]
})
export class PersonalDataPageModule {}
