import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryPage } from './history';
import { PipesModule }    from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HistoryPage
  ],
  imports: [
    IonicPageModule.forChild(HistoryPage),
    PipesModule.forRoot()
  ]
})
export class HistoryPageModule {}