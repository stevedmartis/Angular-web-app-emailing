import { Component, OnInit, Inject } from '@angular/core';
import { ContactsService } from '../../../contacts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-fields',
  templateUrl: './select-fields.component.html',
  styleUrls: ['./select-fields.component.scss']
})
export class SelectFieldsComponent implements OnInit {

  arrayfields: any[] = []

  fieldsForm = new FormControl();

  constructor(
    public matDialogRef: MatDialogRef<SelectFieldsComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public _contactServices: ContactsService,
    

) {


    _data.fields.forEach(f => {

      const obj = {
        name: f,
        select: false,
      }

      this.arrayfields.push(obj)
      
    });

  

    



}
selectField(f){

  f.select = !f.select


}

fieldSelection(){

  console.log(this.arrayfields)

  const selection = this.arrayfields.filter(obj =>  obj.select === true )

  console.log(selection)


  return selection;
}

  ngOnInit() {
  }

}
