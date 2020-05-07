import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { CampaignService } from "./campaign.service";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { AddComponent } from "./dialog/add/add.component";
import { FormGroup } from "@angular/forms";
import { SendComponent } from "./dialog/send/send.component";

@Component({
    selector: "products-campaigns",
    templateUrl: "./campaigns.component.html",
    styleUrls: ["./campaigns.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CampaignsComponent implements OnInit, OnDestroy {
    dialogRef: any;
    campaignExists: boolean = false;

    categories: any[];
    campaigns: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[] = [];

    currentCategory: string;
    searchTerm: string;

    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    eventExist: boolean = true;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

   

    constructor(
        public _matDialog: MatDialog,
        private router: Router,
        public _campaignService: CampaignService,
        private _matSnackBar: MatSnackBar
    ) {

                // Set the defaults
                this.currentCategory = 'all';
                this.searchTerm = '';
        
                // Set the private defaults
                this._unsubscribeAll = new Subject();
    }

    ngOnInit() {

       
        


                // Subscribe to categories
                this._campaignService.onCategoriesChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(categories => {
                    this.categories = categories;
                });
    
            // Subscribe to courses
            this._campaignService.onCampaignChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(courses => {
                    this.filteredCourses = this._campaignService.campaigns;

                    console.log( this.filteredCourses)
                });

    }

    deleteCampaign(campaign) {
        console.log("campaign", campaign);
        this._campaignService.deleteCampaign(campaign).then(x => {
            console.log(x);
        });
    }

    //this.allLoading = false;
    //this.selectLoading = false;
    sendCampaignDialog(campaign) {
        console.log(campaign);
        this.dialogRef = this._matDialog.open(SendComponent, {
            disableClose: true,
            panelClass: "my-class-send",

            data: {
                campaign: campaign
            }
        });

        this.dialogRef.afterClosed().subscribe(response => {
            if (!response) {
                return;
            }

            this._campaignService.allLoading = false;
            this._campaignService.selectLoading = false;
            this._campaignService.value = 0;

            this._campaignService.allContacts = 0;
            this._campaignService.statusSendInvitation = "";
            this._campaignService.invitedFails = [];

            this.dialogRef = null;
        });
    }

    addCampaignDialog() {
        this.dialogRef = this._matDialog.open(AddComponent, {
            panelClass: "my-class-add",
            disableClose: true,
            data: {
                action: "new"
            }
        });

        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            let form = response.getRawValue();

            this._campaignService
                .addCampaign(form)

                .then(x => {
                    console.log(x);


                    
                    setTimeout(() => {

                        this._matSnackBar.open("Campaña creada", "OK", {
                            verticalPosition: "top",
                            duration: 3000
                        });
                        
                    }, 600);




                });

            this._campaignService.previewLoading = false;

            this.dialogRef = null;
        });
    }

    editCampaign(campaign): void
    {
        this.dialogRef = this._matDialog.open(AddComponent, {
            panelClass: "my-class-add",
            disableClose: true,
            data      : {
                campaign: campaign,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._campaignService.editCampaign(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this._campaignService.deleteCampaign(campaign);

                        break;
                }
            });
    }


    linkOfEventOpen(idCampaign){


        console.log(this._campaignService.eventObj)
    const val = 'http://www.turevento.net/#/pages/' + this._campaignService.eventObj.eventName + '/' + idCampaign + '/new';
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);

      this._matSnackBar.open("Link copiado en portapapeles!", "OK", {
        verticalPosition: "top",
        duration: 3000
    });

    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.filteredCourses = [];
    }


    filterCoursesByCategory(): void
    {


        // Re-filter by search term
        this.filterCoursesByTerm();
    }

    filterCoursesByTerm(): void
    {
        const searchTerm = this.searchTerm.toLowerCase();


            this.filteredCourses = this._campaignService.campaigns.filter((course) => {

                return course.affair.toLowerCase().includes(searchTerm);
            });

            
        
    }

    
    
    
}

