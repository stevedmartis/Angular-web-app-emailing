import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { EcommerceProductsComponent } from 'app/main/apps/e-commerce/products/products.component';
import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { EcommerceProductComponent } from 'app/main/apps/e-commerce/product/product.component';
import { EcommerceProductService } from 'app/main/apps/e-commerce/product/product.service';
import { EcommerceOrdersComponent } from 'app/main/apps/e-commerce/orders/orders.component';
import { EcommerceOrdersService } from 'app/main/apps/e-commerce/orders/orders.service';
import { EcommerceOrderComponent } from 'app/main/apps/e-commerce/order/order.component';
import { EcommerceOrderService } from 'app/main/apps/e-commerce/order/order.service';
import { MaterialModule } from 'app/main/angular-material-elements/material.module';

import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';

import { EmailEditorModule } from 'angular-email-editor';
import { ContactsModule } from '../contacts/contacts.module';
import { AuthGuardService } from 'app/main/helpers/auth-guard.service';
import { CampaignsComponent } from './product/campaigns/campaigns.component';
import { CampaignService } from 'app/main/apps/e-commerce/product/campaigns/campaign.service';
import { WebsocketService } from 'app/services/websocket.service';

const routes: Routes = [
    {
        path     : 'products',
        canActivate: [ AuthGuardService ],
        component: EcommerceProductsComponent,
        resolve  : {
            data: EcommerceProductsService
        }
    },
    {
        path     : 'products/:id',
        component: EcommerceProductComponent,
        resolve  : {
            data: EcommerceProductService
        }
    },
    {
        path     : 'products/:id/:handle',
        component: EcommerceProductComponent,
        resolve  : {
            data: EcommerceProductService
        }
    },
    {
        path     : 'orders',
        component: EcommerceOrdersComponent,
        resolve  : {
            data: EcommerceOrdersService
        }
    },
    {
        path     : 'orders/:id',
        component: EcommerceOrderComponent,
        resolve  : {
            data: EcommerceOrderService
        }
    },

];

@NgModule({

    declarations: [
        EcommerceProductsComponent,
        EcommerceProductComponent,
        EcommerceOrdersComponent,
        EcommerceOrderComponent,
        CampaignsComponent,
       


    ],
    imports     : [
        RouterModule.forChild(routes),

        MaterialModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        ContactsModule,
        EmailEditorModule
    ],
    providers   : [
        EcommerceProductsService,
        EcommerceProductService,
        EcommerceOrdersService,
        EcommerceOrderService,
        ContactsService,
        CampaignService,
        WebsocketService

        
       

    ],
    entryComponents: [
        
        
    ]
})
export class EcommerceModule
{
}
