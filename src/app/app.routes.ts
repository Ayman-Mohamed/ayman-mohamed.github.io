import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

export const appRoutes: Routes = [

    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'tsp-ga',
        loadChildren: './tsp-with-genetic-algo-module/tsp-with-genetic-algo.module#TSPGAModule'
    }
];
export const AppModuleRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes /*, { enableTracing: true } */);