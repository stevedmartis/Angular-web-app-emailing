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

      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {

      this.socketStatus = true;
    });

    this.socket.on('online', () => {

      this.socketStatus = true;
    })
  }
  // evento, payload, callback Metodo generico reutilizable
  emit(evento: string, payload?: any, callback?: Function){
    this.socket.emit(evento, payload, callback);
  }

  listen(evento:string){
    return this.socket.fromEvent(evento);
  }
}
