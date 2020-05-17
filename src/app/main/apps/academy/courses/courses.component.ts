import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { AcademyCoursesService } from 'app/main/apps/academy/courses.service';
import { AuthService } from 'app/services/authentication/auth.service';
import { MatDialog , MatSnackBar} from '@angular/material';
import { AddUserComponent } from '../../academy/dialog/add/add.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';

@Component({
    selector   : 'academy-courses',
    templateUrl: './courses.component.html',
    styleUrls  : ['./courses.component.scss'],
    animations : fuseAnimations
})
export class AcademyCoursesComponent implements OnInit, OnDestroy
{
    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    dialogRef: any;
    
      selectRol = [
  
    {label: 'Creador', value: '1'},
    {label: 'Staff', value: '2'},
    {label: 'Cliente', value: '3'},
  
    ]
  

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {AcademyCoursesService} _academyCoursesService
     */
    constructor(
        private _academyCoursesService: AcademyCoursesService,
        private _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the defaults
        this.currentCategory = 'all';
        this.searchTerm = '';

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to categories
        this._academyCoursesService.onCategoriesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(categories => {
                this.categories = categories;
            });

        // Subscribe to courses
        this._academyCoursesService.onCoursesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(courses => {

                console.log(courses)
                this.filteredCourses = this.coursesFilteredByCategory = this.courses = courses;
            });
    }

    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._academyCoursesService.arrayUserData = [];
    }

    addCampaignDialog() {
        this.dialogRef = this._matDialog.open(AddUserComponent, {
            panelClass: "my-class",
            disableClose: true,
            data: {
                action: "new"
            }
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (!response) {
                return;
            }

            console.log('res', response)



                this._academyCoursesService
                .addUser(response)

                .then((x: any) => {

                    console.log('entro', x.user)

                        let  valid =  this._academyCoursesService.emailValid;

                        console.log('valid', valid)
                    
                        if(valid){


                            this.addNewUser(x, valid)

                            this._academyCoursesService.sendMailJet(x.user.email, x.user.username, x.user._id, response.password)
                            .then((res) => {
        
                                console.log(res)
                            })
                            .catch((err) => {
        
                                console.log(err)
                            })

                        }

                        else {

                            
                    this._matSnackBar.open('Email invalido', "OK", {
                        verticalPosition: "top",
                        duration: 3000
                    });

                        }

                                
                })
                .catch((err) => {

                    this._matSnackBar.open(err.error.message, "OK", {
                        verticalPosition: "top",
                        duration: 3000
                    });


                });
                
        





           // this._campaignService.previewLoading = false;

            this.dialogRef = null;
        });
    }


    addNewUser(x, valid){

        this._academyCoursesService.eventObj.users.push({ userId: x.user._id})


        this._academyCoursesService.saveUserEvent()

        .then(() => {

            
        const userUpdate = x.user.emailValid = valid;

        console.log('userUpdate', userUpdate)

    this._academyCoursesService.arrayUserData.push(x.user)
    this._academyCoursesService.onCoursesChanged.next(this._academyCoursesService.arrayUserData);


   
                             
        setTimeout(() => {

            this._matSnackBar.open("Usuario creado y correo de acceso enviado", "OK", {
                verticalPosition: "top",
                duration: 3000
            });
            
        }, 600);




        })

        
    }

    editUser(user): void {
        this.dialogRef = this._matDialog.open(AddUserComponent, {
            panelClass: "my-class",
            disableClose: true,
            data: {
                user: user,
                action: "edit",
            },
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormGroup = response[1];

            console.log('formData', formData)

            let obj = {

                _id: user._id,
                username: formData.value.username,
                name: formData.value.name,
                lastName: formData.value.lastName,
                email: formData.value.email,
                rol: formData.value.rol,
                
              }

            switch (actionType) {
                /**
                 * Save
                 */
                case "save":

                console.log('save')
                this._academyCoursesService.editUser(obj)
                .then((data) => {
                    console.log(data)
                })
                .catch((err) => {
                    console.log(err)
                })

                    break;
                /**
                 * Delete
                 */
                case "delete":
                    this.deleteUser(user);

                    break;
            }
        });
    }

    deleteUser(user): void
    {

        console.log(user)
        this.dialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false,
            panelClass: 'custom-dialog-container'
        });

        this.dialogRef.componentInstance.confirmMessage = 'Esta seguro de borrar este usuario?';

        this.dialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._academyCoursesService.deleteUser(user);
            }
            this.dialogRef = null;
        });
    }

    removeUser(user): void
    {

        console.log(user)
        this.dialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false,
            panelClass: 'custom-dialog-container'
        });

        this.dialogRef.componentInstance.confirmMessage = 'Esta seguro de borrar permanente este usuario?';

        this.dialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._academyCoursesService.removeUser(user);
            }
            this.dialogRef = null;
        });
    }




    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter courses by category
     */
    filterCoursesByCategory(): void
    {
        // Filter
        if ( this.currentCategory === 'all' )
        {
            this.coursesFilteredByCategory = this.courses;
            this.filteredCourses = this.courses;
        }
        else
        {
            this.coursesFilteredByCategory = this.courses.filter((user) => {
                return user.rol === this.currentCategory;
            });

            this.filteredCourses = [...this.coursesFilteredByCategory];

        }

        // Re-filter by search term
        this.filterCoursesByTerm();
    }

    /**
     * Filter courses by term
     */
    filterCoursesByTerm(): void
    {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if ( searchTerm === '' )
        {
            this.filteredCourses = this.coursesFilteredByCategory;
        }
        else
        {
            this.filteredCourses = this.coursesFilteredByCategory.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }
}
