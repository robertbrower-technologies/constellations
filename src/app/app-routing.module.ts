import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './services/auth-guard.service';
import { PreferencesResolveService } from './services/preferences-resolve.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, resolve: { preferences: PreferencesResolveService } },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard], resolve: { preferences: PreferencesResolveService } },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard], resolve: { preferences: PreferencesResolveService } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
