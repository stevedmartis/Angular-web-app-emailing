import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(
    private socket: Socket
  ) { 
    this.checkStatus()
  }

  checkStatus() {
    this.socket.on('connection', () => {

      console.log('contect to server')
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {

      console.log('disconnect to server')
      this.socketStatus = true;
    });

    this.socket.on('online', () => {

      console.log('online to server')
      this.socketStatus = true;
    })
  }
}
