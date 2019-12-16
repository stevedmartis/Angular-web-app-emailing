import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../authentication/auth.service';
 
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
   providers: [AuthService]
})
export class AuthServicesModule { }