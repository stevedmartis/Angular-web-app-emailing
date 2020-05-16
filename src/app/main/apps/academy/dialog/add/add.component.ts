import { Component, OnInit, Inject, Output, Input, EventEmitter,} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, Validator, ValidationErrors, AsyncValidator, NG_VALIDATORS, AsyncValidatorFn, FormControl } from '@angular/forms';

import { Subscription, of, Observable } from 'rxjs';

import { AcademyCoursesService } from '../../courses.service';
import { User } from 'app/models/user';
import { take, debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';
import { EmailValidator } from './emailValidator';

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
  type: string;
  name: string
}


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  
})




export class AddUserComponent implements OnInit {

      
  @Input() text = 'Upload';
  @Input() param = 'file';
@Input() target = 'https://file.io';

fileData = new FileUploadModel();


fileUp: any;

@Output() complete = new EventEmitter<string>();
private files: Array<FileUploadModel> = [];

  user: User;
  dialogTitle = 'Nuevo usuario';
  action: string;
  userForm: FormGroup;
  userFound: User;
 emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 formInvalid: boolean = false;

 debouncer: any;
  rolTypes = [
  {label: 'Creador', value: '1'},
  {label: 'Staff', value: '2'},
  {label: 'Cliente', value: '3'},

  ]



  constructor(
    public matDialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _academyCoursesService: AcademyCoursesService,
    public _emailValidator: EmailValidator
    
    ) {
      // Set the defaults

      console.log('_data', _data)
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Editar usuario';
          this.user = _data.user;


          //this._academyCoursesService.previewLoading = true;
          //this._academyCoursesService.previewUrl = this.campaign.imgBlob;
      }
      else
      {
          this.dialogTitle = 'Nuevo usuario';
          this.user = new User({});

          //this._academyCoursesService.previewLoading = false;
          //this._academyCoursesService.previewUrl = null
      }

      this.userForm = this.createUserForm();
  }

  ngOnInit() {

  }

  randomPassword(){
    var pass = ''; 
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +  
            'abcdefghijklmnopqrstuvwxyz0123456789'; 
      
    for (let i = 1; i <= 10; i++) { 
        var char = Math.floor(Math.random() 
                    * str.length + 1); 
          
        pass += str.charAt(char) 
    } 
      
    return pass; 

  }



  addUser(user){

    console.log(this.f)

if(this.userForm.valid){
  

      let obj = {

        username: user.username,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        rol: user.rol,
        password: user.password
      }

      
     this.matDialogRef.close(obj)

}

else {

  this.formInvalid = true;

  this.f.username.markAsTouched()
  this.f.email.markAsTouched();
  this.f.rol.markAsTouched();
  return;
}






  }



  createUserForm(): FormGroup
  {



      return this._formBuilder.group({
         
          name: [this.user.name],
          lastName: [this.user.lastName],

          email: [this.user.email, Validators.compose([ Validators.required,  Validators.pattern(this.emailPattern)]), 
          this._emailValidator.validatorEmail.bind(this._emailValidator)],
          rol: [this.user.rol, [Validators.required]],
          username: [this.user.username, [Validators.minLength(5)]],
          password: [this.randomPassword()]
          
          })

      
  }

  get f() { return this.userForm.controls; }

  getMesaggeErrorUsername(){
    return  this.f.username.getError('required')? 'Nombre de usuario es requerido' : this.f.username.getError('minlength')? 'Minimo 5 caracteres' : 'Email Validado!';    
  }

  getMesaggeErrorEmail(){

    return this.f.email.getError('required')? 'Email es requerido' : this.f.email.getError('pattern')? 'Formato email Invalido' : this.f.email.getError('emailInvalid')? 'Email Invalido' : '';    


  }


  fileUpload(){

    const type = 'camp'

 
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = (event: any) => {



           // this._academyCoursesService.fileProgress(event.target.files[0], type )

          

           const name = event.target.files[0].name

         this.f.imgTitle.setValue(name)

            
    
       // this.uploadFiles();
    }
    fileUpload.click();
    
}


}

