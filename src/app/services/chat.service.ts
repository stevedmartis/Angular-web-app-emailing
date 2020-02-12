import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    public wsService: WebsocketService
  ) { }

  sendMessage( message: string) {
    const playLoad = {
      by: 'Demaro',
      body: message
    };

    this.wsService.emit('holi', playLoad);
  };

}
