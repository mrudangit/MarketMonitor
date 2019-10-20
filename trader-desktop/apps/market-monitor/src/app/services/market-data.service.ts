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



  constructor() {
    ByteBuffer.DEFAULT_ENDIAN = true;
    this.sharedBuffer =  new SharedArrayBuffer(216);
    this.sharedBufferView = new DataView(this.sharedBuffer);

    postMessage({msgType:WorkerMessageEnum.SHARED_BUFFER_SNAPSHOT, payLoad: this.sharedBuffer}, null);
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


  public closeConnection(){
    this.webSocketClient.close(1000,'ByeBye');
  }

  private connectionLost(event: CloseEvent) {
    console.log('Connection Lost to WebSocket Server: ', event);
  }

  private connectedToServer(event: Event) {

    console.log('Connected to WebSocket Server : ', event);

    const loginInfo = new ClientLoginInfo();
    loginInfo.sendMarketDataUpdates = true;

    this.webSocketClient.send(JSON.stringify(loginInfo));

  }

  private processIncomingWebSocketData(event: MessageEvent) {

    const buffer: Int8Array = new Int8Array(event.data);

    for(let i=0;i< buffer.byteLength;i++){
      this.sharedBufferView.setInt8(i,buffer[i],);
    }


    postMessage({msgType: WorkerMessageEnum.SHARED_BUFFER_UPDATE, payLoad: null}, null);






  }
}
