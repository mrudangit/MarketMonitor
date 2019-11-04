import { ClientLoginInfo } from '../models/ClientLoginInfo';

import {  WorkerMessageEnum } from '../models/WorkerMessage';
import { MarketData } from '../models/MarketData';

declare var window;
export class MarketDataService {

  private readonly marketDataServer = 'ws://mrudang-WS-Z390-PRO:10000/marketData';
  private webSocketClient: WebSocket;
  private sharedBuffer: SharedArrayBuffer;
  private sharedBufferView: DataView;
  public loginInfo: ClientLoginInfo = new ClientLoginInfo();
  private sharedBufferViewArray: Uint8Array;
  public numberOfBytesRx = 0;
  private timerHandle: any;



  constructor() {

    this.createSharedBuffer();

    postMessage({msgType:WorkerMessageEnum.SHARED_BUFFER_SNAPSHOT, payLoad: this.sharedBuffer}, null);

    this.initializeWebSocket();
  }

  private initializeWebSocket(){

    this.webSocketClient = new WebSocket(this.marketDataServer);
    this.webSocketClient.binaryType = 'arraybuffer';
    this.webSocketClient.addEventListener('message', (event) => {
      this.processIncomingWebSocketData(event);
    });
    this.webSocketClient.addEventListener('open', (event) => {
      this.connectedToServer(event);
    });

    this.webSocketClient.onclose = (event) => {
      this.connectionLost(event);
    }

  }

  private createSharedBuffer(){

    this.sharedBuffer = new SharedArrayBuffer(this.loginInfo.marketDataSnapShotSize*MarketData.SIZE);
    this.sharedBufferViewArray = new Uint8Array(this.sharedBuffer);
    this.sharedBufferView = new DataView(this.sharedBuffer);

  }


  public closeConnection(){
    this.webSocketClient.close(1000,'ByeBye');
  }

  private connectionLost(event: CloseEvent) {
    console.log('Connection Lost to WebSocket Server: ', event);
  }

  private connectedToServer(event: Event) {

    console.log('Connected to WebSocket Server : ', event);


    this.webSocketClient.send(JSON.stringify(this.loginInfo));

    this.timerHandle = setInterval(() => {
      const numOfMbPerSecond = (this.numberOfBytesRx/1024)/1024;
      console.log('Number of MB per Second : ', numOfMbPerSecond);
      this.numberOfBytesRx =  0;
    },1000)

  }

  private processIncomingWebSocketData(event: MessageEvent) {

    const rawBuffer: ArrayBuffer = event.data;

    this.numberOfBytesRx = this.numberOfBytesRx + rawBuffer.byteLength;

    if(rawBuffer.byteLength === this.sharedBuffer.byteLength){

      const ubuffer  = new Uint8Array(event.data);
      this.sharedBufferViewArray.set(ubuffer);

    } else {
      const dataView = new DataView(rawBuffer);
      const numOfUpdates = rawBuffer.byteLength/ MarketData.SIZE;

      for(let i=0; i < numOfUpdates;i++ ){

        const index = dataView.getInt32(i*MarketData.SIZE,true);

        const buffer1 = new Uint8Array(rawBuffer,i*MarketData.SIZE, MarketData.SIZE);

        this.sharedBufferViewArray.set(buffer1, index*MarketData.SIZE);
      }



    }



    // postMessage({msgType: WorkerMessageEnum.SHARED_BUFFER_UPDATE, payLoad: null}, null);






  }
}
