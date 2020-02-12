import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule, } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { registerLocaleData } from '@angular/common';

import localePy from '@angular/common/locales/es-PY';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import localeEsAR from '@angular/common/locales/es-AR';



import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseConfig } from 'app/fuse-config';
import {MAT_DATE_LOCALE} from '@angular/material';
import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
import { AuthServicesModule } from '../app/services/authentication/auth.module';
import { EventServicesModule } from '../app/services/eventos/event.modules';
import { AuthGuardService } from '../app/main/helpers/auth-guard.service';
import { InterceptorService } from './services/interceptor.service';
import { SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import { environment } from 'environments/environment.prod';

const appRoutes: Routes = [
    {
        path        : 'apps',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule)
    },
    {
        path        : 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule) 
    },
    {
        path        : 'ui',
        loadChildren: './main/ui/ui.module#UIModule'
    },
    {
        path        : 'documentation',
        loadChildren: './main/documentation/documentation.module#DocumentationModule'
    },
    {
        path        : 'angular-material-elements',
        loadChildren: './main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule'
    },
    {
        path      : '**',
        redirectTo: 'apps/dashboards/analytics'
    },

    

];

registerLocaleData(localePy, 'es');
registerLocaleData(localePt, 'pt');
registerLocaleData(localeEn, 'en')
registerLocaleData(localeEsAR, 'es-Ar');


const config: SocketIoConfig = {
    url:  environment.apiUrl, options: {}
}

@NgModule({
    declarations: [
        AppComponent,

    ],
    imports     : [
        
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {  useHash: true }),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule,
        AuthServicesModule,
        EventServicesModule,

        SocketIoModule.forRoot(config),
    ],
    providers: [


        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
          },

          { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
          { provide: LOCALE_ID, useValue: "es-Ar" },

        AuthGuardService
    ],
    bootstrap   : [
        AppComponent
    ],

    
})
export class AppModule
{
}
