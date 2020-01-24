import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog } from '@angular/material';
import { EditorCampaignComponent } from './diaglog/editor-campaign/editor-campaign.component';
import { EmailEditorComponent } from 'angular-email-editor';
import { Router } from '@angular/router'

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  animations: fuseAnimations
})
export class CampaignsComponent implements OnInit {

  dialogRef: any;
  confirmDialogRef: MatDialogRef<EditorCampaignComponent>;
  campaignExists: boolean = false;

   
  constructor(public _matDialog: MatDialog,
            private router: Router,) { }

  ngOnInit() {
  }



      OpenEditorCampaign(): void
      {
          this.confirmDialogRef = this._matDialog.open(EditorCampaignComponent, {
              disableClose: false,
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              maxWidth: "100%"
          });
  
          this.confirmDialogRef.componentInstance.confirmMessage = 'Esta seguro de eliminar este invitado?';
  
          this.confirmDialogRef.afterClosed().subscribe(result => {
              if ( result )
              {
                
              }

              else {

              
                //this.router.navigate(['apps/e-commerce/products/asdas/']);
              }
              this.confirmDialogRef = null;
          })
         
      }




}
