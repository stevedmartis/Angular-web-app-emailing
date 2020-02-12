import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'dashboards/analytics',
        loadChildren: () => import('./dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule)
    },
    {
        path        : 'dashboards/project',
        loadChildren: () => import('./dashboards/project/project.module').then(m => m.ProjectDashboardModule)
    },
    {
        path        : 'mail',
        loadChildren: './mail/mail.module#MailModule'
    },
    {
        path        : 'mail-ngrx',
        loadChildren: './mail-ngrx/mail.module#MailNgrxModule'
    },
    {
        path        : 'chat',
        loadChildren: './chat/chat.module#ChatModule'
    },
    {
        path        : 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
    },
    {
        path        : 'e-commerce',
        loadChildren: () => import('./e-commerce/e-commerce.module').then(m => m.EcommerceModule)

    },
    {
        path        : 'academy',
        loadChildren: './academy/academy.module#AcademyModule'
    },
    {
        path        : 'todo',
        loadChildren: './todo/todo.module#TodoModule'
    },
    {
        path        : 'file-manager',
        loadChildren: './file-manager/file-manager.module#FileManagerModule'
    },
    {
        path        : 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path        : 'scrumboard',
        loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class AppsModule
{
}
