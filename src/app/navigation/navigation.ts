import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'APLICACIONES',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
            {
                id       : 'dashboards',
                title    : 'Dashboards',
                translate: 'NAV.DASHBOARDS',
                type     : 'collapsable',
                icon     : 'dashboard',
                children : [
                    {
                        id   : 'analytics',
                        title: 'Analítica',
                        type : 'item',
                        icon     : 'pie_chart',
                        url  : '/apps/dashboards/analytics'
                    },
                ],
            },
            {
                id       : 'events',
                title    : 'Eventos',
                translate: 'NAV.EVENTS',
                type     : 'item',
                icon     : 'event',
                url      : '/apps/e-commerce/products',
            
            },

        
        ]
        
    
    },



    
];


export const navigationClient: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'APLICACIONES',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
            {
                id       : 'dashboards',
                title    : 'Dashboards',
                translate: 'NAV.DASHBOARDS',
                type     : 'collapsable',
                icon     : 'dashboard',
                children : [
                    {
                        id   : 'analytics',
                        title: 'Analítica',
                        type : 'item',
                        icon     : 'pie_chart',
                        url  : '/apps/dashboards/analytics'
                    },
                ],
            },
 

        
        ]
        
    
    },



    
];
