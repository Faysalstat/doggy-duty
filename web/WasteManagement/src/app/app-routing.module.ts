import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './modules/layout/app.layout.component';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { AppAuthGuard } from './app-auth.guard';

const routes: Routes = [
  {
      path: '',canActivate:[AppAuthGuard],component: AppLayoutComponent,
      children: [
          { path: '', loadChildren: () => import('./modules/components/dashboard/dashboard.module').then(m => m.DashboardModule) }
      ]
  },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'landing', loadChildren: () => import('./modules/components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
