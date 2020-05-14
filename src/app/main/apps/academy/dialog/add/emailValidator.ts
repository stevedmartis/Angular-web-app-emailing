
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AcademyCoursesService } from '../../courses.service';


@Injectable()
export class UsernameValidator {

  debouncer: any;

  constructor(public _academyCoursesService: AcademyCoursesService){

  }
  
    
checkUsername(control: FormControl): any {

  clearTimeout(this.debouncer);

  return new Promise(resolve => {

  

      this._academyCoursesService.emailValidator(control.value)
      .subscribe((data) => {
       


            let result = data.result.data.debounce.result;
                  
            let valid = result === "Invalid"? false : true;


         
            if(valid){

                this._academyCoursesService.emailValid = true;

                console.log(valid)

                resolve(null);

            }

            else {

                console.log(valid)

                this._academyCoursesService.emailValid = false;
                resolve({ emailInvalid : true });

            }
        
         
        
      });
    

  });
}

}



