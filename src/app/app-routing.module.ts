import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MindmapHolderComponent} from "./mindmap-holder/mindmap-holder.component";
import {SearchResultComponent} from "./search-result/search-result.component";
import {MainComponent} from "./main/main.component";
import {SubscribedLabelsComponent} from "./subscribed-labels/subscribed-labels.component";
import {LabelDetailComponent} from "./label-detail/label-detail.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'mindmap/:mapId',
        component: MindmapHolderComponent,
      }, {
        path: 'search',
        component: SearchResultComponent,
      },
      {
        path: 'subscribed',
        component: SubscribedLabelsComponent,
        children: [
          {
            path: ':labelId',
            component: LabelDetailComponent,
          }
        ]
      }
    ]
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
