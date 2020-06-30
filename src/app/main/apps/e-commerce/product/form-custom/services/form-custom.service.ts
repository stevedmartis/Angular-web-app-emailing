import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Injectable()
export class FormCustomService {

  idEventNow: any;

  onInputsArrayChange: BehaviorSubject<any>;
  eventExist: boolean = false;

  inputsEnabledForm: FormGroup;
  inputsSelectionForm: FormGroup;


  constructor( private _httpClient: HttpClient,  private _formBuilder: FormBuilder) { 

    this.onInputsArrayChange = new BehaviorSubject([]);
    this.inputsEnabledForm = this.createInputsEnabledForm();
    this.inputsSelectionForm = this.createInputSelectionForm();

  }

  createInputsEnabledForm(): FormGroup {
    return this._formBuilder.group({
        fieldsEnabled: this._formBuilder.array([]),
    });
}

removeInputs(){


  while (this.formDataFieldsInputs.length > 0) {
    this.formDataFieldsInputs.removeAt(0);
  }

  while (this.formDataFieldsInputsSelection.length > 0) {
    this.formDataFieldsInputsSelection.removeAt(0);
  }

}

createInputSelectionForm(): FormGroup {
    return this._formBuilder.group({
        fieldsSelection: this._formBuilder.array([]),
    });
//lo
    
}

get enabledF() {
  return this.inputsEnabledForm.controls;
}

get selectionF() {
  return this.inputsSelectionForm.controls;
}

get formDataFieldsInputs() {
  return <FormArray>this.enabledF.fieldsEnabled;
}

get formDataFieldsInputsSelection() {
  return <FormArray>this.selectionF.fieldsSelection;
}


getMesaggeErrorTitle(i, title){

  return (<FormArray>this.inputsEnabledForm.get('fieldsEnabled')).controls[i].invalid && title.length === 0? 'Nombre del campo obligatorio' :  (<FormArray>this.inputsEnabledForm.get('fieldsEnabled')).controls[i].invalid && title.length < 3? 'Minimo 3 letras' : '';
  
}

getInputsEventOrInitial(input){ 

    if(input ){

        
        this.pushDataInArrays(input)

    }

    else {


      this.getInputsInitial()
      .then((array) => {

        console.log(array)

        array.forEach(obj => {

          console.log(obj)

          this.addInputFormInEvent(obj)
    
          .then((data) => {

            console.log(data)

            this.pushDataInArrays(data.input)

            return array;



          })
          
        });
      })

    
      


    }



}


 


pushDataInArrays(obj){

                                        
  if(obj.column === 1){

      this.patchFieldsEnabled(obj);
  }

  else if (obj.column === 2) {

      this.patchFieldsSelection(obj);
  }
}

patchFieldsEnabled(obj) {



  const fields = <FormArray>this.enabledF.fieldsEnabled;


     fields.push(this.patchValuesEnables(obj._id, obj, 1));
 
}

patchFieldsSelection(obj) {



  const fields = <FormArray>this.selectionF.fieldsSelection;

 
  fields.push(this.patchValuesSelection(obj._id, obj, 2));

}

patchValuesEnables(id, obj, Ncolumn) {


  return this._formBuilder.group({
      id: id,
      title: [obj.title, [Validators.required, Validators.minLength(3)]],
      value: obj.value,
      placeHolder: obj.placeHolder,
      edit: obj.edit,
      type: obj.type,
      column: Ncolumn,
      nameControl: obj.nameControl,
      required: obj.required,
  });
}

patchValuesSelection(id, obj, Ncolumn) {


  return this._formBuilder.group({
      id: id,
      title: [obj.title, [Validators.required]],
      value: obj.required
          ? [obj.value]
          : obj.value,
      placeHolder: obj.placeHolder,
      edit: obj.edit,
      type: obj.type,
      column: Ncolumn,
      nameControl: obj.nameControl,
      required: obj.required,
  });
}


clearFormArray = (formArray: FormArray) => {
  formArray = this._formBuilder.array([]);
}

  getInputsEvent(): Promise<any> {

    
    return new Promise((resolve, reject) => {
        this._httpClient.get(environment.apiUrl + '/api/form/event/' + this.idEventNow)
            .subscribe((response: any) => {


         resolve( response.inputs)

            }, reject);
    });
}

getInputsInitial(): Promise<any> {

    
  return new Promise((resolve, reject) => {
      this._httpClient.get(environment.apiUrl + '/api/form/initial')
          .subscribe((response: any) => {
            
          
           resolve( response.inputs)
              
          }, reject);
  });
}

createInputsInitial(): Promise<any> {

       
  return new Promise((resolve, reject) => {

    let count = 0;

    this.getInputsInitial()
    .then((data) =>{


      data.forEach(obj => {

      
        this.addInputFormInEvent(obj)
        .then((x) => {


            resolve(x)
          
        })
        
      });
    })
  });
}


addInputFormInEvent(input): Promise<any> {

       
    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/form/new-input', 
        {   
             codeEvento:  this.idEventNow,
             title: input.title,
             type: input.type,
             placeHolder: input.placeHolder,
             value: input.value,
             required: input.required,
             initial: false

        })
            .subscribe((response: any) => {

          
                resolve(response);
                
            }, reject);
    });
}


editInputFormRequired(input): Promise<any>
{
  
    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/form/edit-input-required', 
        {   

            inputId: input.id,
            required: input.required,


        })
            .subscribe((response: any) => {

                
                resolve(response);

     
            }, reject);
    });
}

editInputFormtitle(input): Promise<any>
{
  
    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/form/edit-input-title', 
        {   

            inputId: input.id,

            title: input.title

        })
            .subscribe((response: any) => {

                
                resolve(response);

  
            }, reject);
    });
}

editInputFormColumnSelect(inputId): Promise<any>
{
  
    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/form/edit-input-column-select', 
        {   

            inputId: inputId,
        })
            .subscribe((response: any) => {

                
                resolve(response);

  
            }, reject);
    });
}


editInputFormColumnEnabled(inputId): Promise<any>
{
  
    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/form/edit-input-column-enabled', 
        {   

            inputId: inputId,
        })
            .subscribe((response: any) => {

                
                resolve(response);

  
            }, reject);
    });
}

}
