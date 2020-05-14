import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FuseSharedModule } from '@fuse/shared.module';

import { AcademyCoursesComponent } from 'app/main/apps/academy/courses/courses.component';
import { AcademyCourseComponent } from 'app/main/apps/academy/course/course.component';
import { AcademyCoursesService } from 'app/main/apps/academy/courses.service';
import { AcademyCourseService } from 'app/main/apps/academy/course.service';
import { FuseSidebarModule } from '@fuse/components';
import { AddUserComponent } from '../academy/dialog/add/add.component';
import { MaterialModule } from 'app/main/angular-material-elements/material.module';
import { UsernameValidator  } from '../academy/dialog/add/emailValidator';


const routes = [
    {
        path     : 'courses',
        component: AcademyCoursesComponent,
        resolve  : {
            academy: AcademyCoursesService
        }
    },

];

@NgModule({
    declarations: [
        AcademyCoursesComponent,
        AcademyCourseComponent,
        AddUserComponent,
        
        
    ],
    exports: [
        AcademyCoursesComponent,
        AcademyCourseComponent,
        AddUserComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MaterialModule,

        FuseSharedModule,
        FuseSidebarModule
    ],
    providers   : [
        AcademyCoursesService,
        AcademyCourseService,
        UsernameValidator
        
    ],
    entryComponents: [
        AddUserComponent
    ],
    
    
})
export class AcademyModule
{
}
