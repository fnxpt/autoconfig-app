import { Routes, RouterModule } from '@angular/router';

import { EnvironmentsComponent } from './environments/environments.component';

const ROUTES: Routes = [
  { path: '', component: EnvironmentsComponent, pathMatch: 'full' },
  { path: 'logs', loadChildren: () => import('app/logs/logs.module').then(m => m.LogsModule) },
  { path: 'network-logs', loadChildren: () => import('app/network-logs/network-logs.module').then(m => m.NetworkLogsModule) },
  { path: 'settings', loadChildren: () => import('app/settings/settings.module').then(m => m.SettingsModule) }
];

export const RoutingModule = RouterModule.forRoot(ROUTES);
