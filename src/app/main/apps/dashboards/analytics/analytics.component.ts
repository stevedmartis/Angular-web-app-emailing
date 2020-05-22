import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { EcommerceProductsService } from '../../e-commerce/products/products.service';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthService } from 'app/services/authentication/auth.service';

@Component({
    selector     : 'analytics-dashboard',
    templateUrl  : './analytics.component.html',
    styleUrls    : ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy
{
    widgets: any;
    widget1SelectedYear = 'toDay';
    widget5SelectedDay = 'today';
    dateSelect: any;

    

    

 


    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        public _analyticsDashboardService: AnalyticsDashboardService,
        public datepipe: DatePipe,
        private _location: Location,
        private _fuseConfigService: FuseConfigService,
        public _authService: AuthService
        
    )
    {
        // Register the custom chart.js plugin
        this._registerCustomChartJSPlugin();

        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {


        
    }

    exportToXls(eventId){

        this._analyticsDashboardService.getContacts(eventId)
        .then((data) => {

            this._analyticsDashboardService.exportAsExcelFile('bd_turevento', data);


        })

    
      }

    

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void
    {
        (window as any).Chart.plugins.register({
            afterDatasetsDraw: function(chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function(dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                        meta.data.forEach(function(element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

    dateChange(index, event){

        let  myDate = event._d

                    
        let toDayShort = this.datepipe.transform(
            myDate,
            "dd/MM"
        )

        let DateSelect = this.datepipe.transform(
            myDate,
            "EEEE dd/LLL"
        )

        console.log('date change', index, toDayShort)

     let item = this._analyticsDashboardService.eventsArray[index];

     console.log(item)

    const daySelect = item.widget1.datasets.selectDay;


                                
     let dataStatusSent = this._analyticsDashboardService.dataStatus(item.countSent[0], toDayShort);

     let dataStatusOpen = this._analyticsDashboardService.dataStatus(item.countOpen[0], toDayShort);

     let dataStatusClicked = this._analyticsDashboardService.dataStatus(item.countClicked[0], toDayShort);

     console.log(dataStatusSent,
        dataStatusOpen,
        dataStatusClicked)

        console.log('daySelect', daySelect)

       
        daySelect[0].data = dataStatusClicked;

        daySelect[1].data = dataStatusOpen;
    
        daySelect[2].data = dataStatusSent;
    

        console.log('new', item)

        
        console.log('new', item)

        this.widget1SelectedYear = 'selectDay'

        item.widget1.dateSelect = DateSelect;


        
    }

    ngOnDestroy(){
        this._analyticsDashboardService.eventsArray = [];

        this._analyticsDashboardService.arrayFormatDate = []
        this._analyticsDashboardService.arrayInvitedForDate =[]
    }
}

