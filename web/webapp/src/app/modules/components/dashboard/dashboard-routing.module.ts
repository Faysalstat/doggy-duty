import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'service', loadChildren: () => import('./job-service/job-service.module').then(m => m.JobServiceModule) },
        { path: 'work-order', loadChildren: () => import('./work-order/work-order.module').then(m => m.WorkOrderModule) },
        { path: 'community', loadChildren: () => import('./community/community.module').then(m => m.CommunityModule) },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
