import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {

    this.currentEventSubject = new BehaviorSubject<Event>(JSON.parse(localStorage.getItem('currentEvent')));
   }

   private currentEventSubject: BehaviorSubject<Event>;
   public currenEvent: Observable<Event>;
   loading: boolean = false;
 
   public get currentUserValue(): Event {
     return this.currentEventSubject.value;
 }
}

