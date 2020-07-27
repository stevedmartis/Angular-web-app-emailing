
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AcademyCoursesService } from '../../courses.service';


@Injectable()
export class EmailValidator {

  debouncer: any;

  constructor(public _academyCoursesService: AcademyCoursesService){

  }
  
    
validatorEmail(control: FormControl): any {

  clearTimeout(this.debouncer);

  return new Promise(resolve => {

  

      this._academyCoursesService.emailValidator(control.value)
      .subscribe((data) => {
       


            let result = data.result.data.debounce.result;

      
          
                  
            let valid = result === "Invalid" ? false : 
                        result === "Risky"? true : 
                        result === "Safe to Send" ? true : 
                        result === "Unknown"? true : null;


         
            if(valid){

                this._academyCoursesService.emailValid = true;

     

                resolve(null);

            }

            else {

             

                this._academyCoursesService.emailValid = false;
                resolve( { emailInvalid : true })

            }
        
         
        
      });
    

  });
}

}



