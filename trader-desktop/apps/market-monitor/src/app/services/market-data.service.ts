import { ClientLoginInfo } from '../models/ClientLoginInfo';


import * as ByteBuffer from 'bytebuffer';
import { WorkerMessage, WorkerMessageEnum } from '../models/WorkerMessage';
import { MarketData } from '../models/MarketData';

declare var window;
export class MarketDataService {

  private readonly marketDataServer = 'ws://mrudang-WS-Z390-PRO:10000/marketData';
  private webSocketClient: WebSocket;
  private sharedBuffer: SharedArrayBuffer;
  private sharedBufferView: DataView;
  private loginInfo: ClientLoginInfo = new ClientLoginInfo();



  constructor() {

    this.loginInfo.sendMarketDataUpdates = true;
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

  }

  private processIncomingWebSocketData(event: MessageEvent) {

    const buffer: Int8Array = new Int8Array(event.data);

    for(let i=0;i< buffer.byteLength;i++){
      this.sharedBufferView.setInt8(i,buffer[i],);
    }


    postMessage({msgType: WorkerMessageEnum.SHARED_BUFFER_UPDATE, payLoad: null}, null);






  }
}
