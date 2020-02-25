import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router'
import { CampaignService } from './campaign.service';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AddComponent } from './dialog/add/add.component';
import { FormGroup } from '@angular/forms';
import { SendComponent } from './dialog/send/send.component';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  animations: fuseAnimations
})
export class CampaignsComponent implements OnInit {

  dialogRef: any;
  campaignExists: boolean = false;
  dataSource: FilesDataSource | null;


  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  eventExist: boolean = true;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  constructor(public _matDialog: MatDialog,
            private router: Router,
            private _campaignService: CampaignService,
            private _matSnackBar: MatSnackBar,
            ) { }

  ngOnInit() {

    this._campaignService.getCampaigns()
    .then(x => 
      {
        this.dataSource = new FilesDataSource(this._campaignService, this.paginator, this.sort);
        console.log('this.dataSource ', this.dataSource)
      })
  }

  deleteCampaign(campaign){

    console.log('campaign', campaign)
    this._campaignService.deleteCampaign(campaign)
    .then(x => {
      console.log(x)
    })
  }


  sendCampaignDialog(campaign){

    console.log(campaign)
    this.dialogRef = this._matDialog.open(SendComponent, {
      disableClose: true,
      width: '50%',
      height: '40%',
      data      : {
        campaign: campaign
      }

  });

}

  addCampaignDialog(){
    this.dialogRef = this._matDialog.open(AddComponent, {
      disableClose: true,
      data      : {
        action: 'new'
      }

  });

  this.dialogRef.afterClosed()
  .subscribe((response: FormGroup) => {
    if ( !response )
    {
        return;
    }


        console.log('product post delete', response);

        let form = response.getRawValue();

        this._campaignService.addCampaign(form)

        
        .then(x => {

            console.log(x)
            this._matSnackBar.open('Campaña creada', 'OK', {
                verticalPosition: 'top',
                duration        : 3000
            });
        })
        
    
    this.dialogRef = null;
});
  }


}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {EcommerceProductsService} _ecommerceCampaignService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _ecommerceCampaignService: CampaignService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._ecommerceCampaignService.campaigns;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._ecommerceCampaignService.onCampaignhanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._ecommerceCampaignService.campaigns.slice();


                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
    }

   

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
