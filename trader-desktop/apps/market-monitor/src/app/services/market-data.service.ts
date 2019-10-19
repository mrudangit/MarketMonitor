import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  private readonly marketDataServer = 'ws://mrudang-WS-Z390-PRO:10000/marketData';
  private webSocketClient: WebSocket;
  private encoder = new TextEncoder();

  constructor() {
    this.webSocketClient = new WebSocket(this.marketDataServer);
    this.webSocketClient.addEventListener('message', (event) => {
      this.processIncomingData(event);
    });
    this.webSocketClient.addEventListener('open', (event) => {
    this.connectedToServer(event);
    });

    this.webSocketClient.onclose = (event) => {
      this.connectionLost(event);
    }
  }


  private connectionLost(event: CloseEvent) {
    console.log('Connection Lost : ', event);
  }

  private connectedToServer(event: Event) {
    console.log('Connected : ', event);
    const s = 'Hello World';
    const uint8Array = this.encoder.encode(s);
    this.webSocketClient.send(uint8Array);

  }

  private processIncomingData(event: MessageEvent) {
    console.log('Incoming Data : ', event.data);
  }
}
