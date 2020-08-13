
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { InvitationQrScanService } from './invitation-qr-scan.service';
import { Invited } from '../invited.module';

import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'lock',
  templateUrl: './invitation-qr-scan.component.html',
  styleUrls: ['./invitation-qr-scan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class InvitationQrScanComponent implements OnInit, OnDestroy {
    invitationForm: FormGroup;

    invited: Invited;
    assit_checked: boolean = false;

    private _unsubscribeAll: Subject<any>;

    

    
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];


  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
   
    
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _formInvitationService: InvitationQrScanService,
        private router: Router
    ) {

      

        this.invited = new Invited({});



        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

   
        // Subscribe to update product on changes
        this._formInvitationService.onInvitedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(invited => {


                if ( !invited.invited)
                {


                    this.invited = new Invited({});

              
    
                }
                else
                {


          
                    this.invited = new Invited(invited.invited);
                   

                    this._formInvitationService.getTagsByEvent().then( ( ) => {

                 

                      const array = this._formInvitationService.tagsArray.map(
                        tag => tag.name
                      )

              

                      this.filteredTags = this.tagCtrl.valueChanges.pipe(
                        
                        startWith(null),

                    
                        map((tag: string | null) => tag ? this._filter(tag) : array.slice()));
                    })

                    
                }

                this.invitationForm = this.createInvitedForm();

            });

    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


        createInvitedForm(): FormGroup
    {

        return this._formBuilder.group({
            invitedId: [this.invited._id, [Validators.required]], 

            contactado: ['email'],
        });
    }


    confirmInvitation(){
       const data = this.invitationForm.getRawValue();



        this._formInvitationService.assistCheced(data)
        .then( (inv: Invited ) => {

            //this.router.navigate(['/pages/confirm/si/' + this._formInvitationService.campaignId + '/' + this.invited._id])

            this.assit_checked = true;
        })

    }




  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._formInvitationService.tagsArray.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


}


