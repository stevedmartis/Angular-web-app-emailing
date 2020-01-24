import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ViewChildren, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EmailEditorComponent } from 'angular-email-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor-campaign',
  templateUrl: './editor-campaign.component.html',
  styleUrls: ['./editor-campaign.component.scss']
})
export class EditorCampaignComponent implements OnInit, AfterViewInit, OnDestroy {

  public confirmMessage: string;

  
  @ViewChild(EmailEditorComponent, {static: false}) emailEditor: EmailEditorComponent
  private subs: Subscription[] = [];
  /**
   * Constructor
   *
   * @param {MatDialogRef<EditorCampaignComponent>} dialogRef
   */
  constructor(
      public dialogRef: MatDialogRef<EditorCampaignComponent>
  ){ }

  ngOnInit() {
 console.log('onInit')
    
  }

  ngAfterViewInit(){

   console.log(this.emailEditor)
  }

  ngOnDestroy(){
console.log('onDestroy')
     
  }

  exportHtml() {
  
    this.emailEditor.exportHtml((res) => {

      console.log('exportHtml', res)

      let data = res;

      console.log(data)

      this.subs.push()

  })





}

}
