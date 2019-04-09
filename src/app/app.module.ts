import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MindmapBodyModule} from "./mindmap-body/mindmap-body.module";
import {HttpClientModule} from "@angular/common/http";
import {HttpLinkModule} from "apollo-angular-link-http";
import {ApolloModule} from "apollo-angular";
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { MindmapHolderComponent } from './mindmap-holder/mindmap-holder.component';
import {LeftControlComponent} from "./left-control/left-control.component";
import {ListComponent} from "./list/list.component";
import { SearchResultComponent } from './search-result/search-result.component';
import { ParseLinksDirective } from './parse-links.directive';
import {Ng2UiAuthModule} from "ng2-ui-auth";
import {environment} from "../environments/environment";
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { LabelsComponent } from './labels/labels.component';
import { LabelDetailComponent } from './label-detail/label-detail.component';
import { SubscribedLabelsComponent } from './subscribed-labels/subscribed-labels.component';
import { EntityListComponent } from './entity-list/entity-list.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MindmapHolderComponent,
    LeftControlComponent,
    ListComponent,
    SearchResultComponent,
    ParseLinksDirective,
    MainComponent,
    LoginComponent,
    LabelsComponent,
    LabelDetailComponent,
    SubscribedLabelsComponent,
    EntityListComponent,
  ],
  imports: [
    MindmapBodyModule,
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    BrowserAnimationsModule,
    Ng2UiAuthModule.forRoot({
      providers: {
        github: {
          clientId: '3ebc782dbfbb301f45cf',
          url: environment.githubAuthUrl,
        }
      }
    })
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
