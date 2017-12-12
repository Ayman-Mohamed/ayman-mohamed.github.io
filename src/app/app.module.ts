import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppModuleRouting } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        SharedModule.forRoot(),

        AppModuleRouting
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
