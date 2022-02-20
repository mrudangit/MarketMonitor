import {Component, ViewChild} from '@angular/core';
import { MarketData } from './models/MarketData';
import { WorkerMessage, WorkerMessageEnum } from './models/WorkerMessage';
import {AgGridAngular} from "ag-grid-angular";
import {ClientLoginInfo} from "./models/ClientLoginInfo";
declare let crossOriginIsolated;
@Component({
  selector: 'trader-desktop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'market-monitor';
  private messagingWorker: Worker;
  private marketData: MarketData;
  private marketDataList: Array<MarketData> = new Array<MarketData>();
  private marketDataMap: Map<number, MarketData> = new Map<number, MarketData>();

  firstRow: number;
  lastRow: number;
  totalDisplayedRows: number;
  numOfRecords: number;
  clientLoginInfo = new ClientLoginInfo();

  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;


  rowData: any;
  columnDefs = [
    {headerName: 'Symbol', field: 'symbol', resizable: true },
    {headerName: 'Mid', field: 'mid' },

    {headerName: 'Bid', field: 'bidPrice0'},
    {headerName: 'Spread', field: 'spread' },
    {headerName: 'Ask', field: 'askPrice0'},
    {headerName: 'BidSize', field: 'bidSize0'},

    {headerName: 'AskSize', field: 'askSize0'},

    {headerName: 'Bid1', field: 'bidPrice1'},
    {headerName: 'BidSize1', field: 'bidSize1'},
    {headerName: 'Bid2', field: 'bidPrice2'},
    {headerName: 'BidSize2', field: 'bidSize2'},
    {headerName: 'Bid3', field: 'bidPrice3'},
    {headerName: 'BidSize3', field: 'bidSize3'},
    {headerName: 'Bid4', field: 'bidPrice4'},
    {headerName: 'BidSize4', field: 'bidSize4'},

    {headerName: 'Ask1', field: 'askPrice1'},
    {headerName: 'AskSize1', field: 'askSize1'},
    {headerName: 'Ask2', field: 'askPrice2'},
    {headerName: 'AskSize2', field: 'askSize2'},
    {headerName: 'Ask3', field: 'askPrice3'},
    {headerName: 'AskSize3', field: 'askSize3'},
    {headerName: 'Ask4', field: 'askPrice4'},
    {headerName: 'AskSize4', field: 'askSize4'},


    {headerName: 'RevisionID', field: 'revisionId'}
  ];
  private timerHandle: any;
  mbPerSecond: number;

  constructor(){

    this.messagingWorker =  new Worker(new URL('./webWorker/messaging.worker.ts',import.meta.url), {name:'messaging', type: 'module' });

    this.messagingWorker.addEventListener('message', ev => {
      this.processMessage(ev);
    });

  }

  startSubscribing($event: MouseEvent) {
    if (typeof  window !== undefined){
      console.log('We are in Main App');
    }
    if (!crossOriginIsolated) {

      console.log('Cross Origin Isolated is FALSE');

    }
    this.messagingWorker.postMessage('start');
  }

  stopSubscribing($event: MouseEvent) {

    this.messagingWorker.postMessage('stop');
  }

  private processMessage(event: MessageEvent) {


    const workerMessage: WorkerMessage = event.data;

    if( workerMessage.msgType === WorkerMessageEnum.SHARED_BUFFER_SNAPSHOT) {
      this.handleMarketDataSnapshot(workerMessage);
    }


    if( workerMessage.msgType === WorkerMessageEnum.MB_PER_SECOND) {
      this.mbPerSecond = workerMessage.payLoad.mb;
      console.log('In Main App : MB Per Second : ', workerMessage.payLoad.mb);
    }



    this.timerHandle = setInterval(() => {
      this.refreshMarketData();
    }, this.clientLoginInfo.updateFrequency);
  }


  handleMarketDataSnapshot( workerMessage: WorkerMessage){


      const buffer: SharedArrayBuffer = workerMessage.payLoad;
      this.numOfRecords = buffer.byteLength/MarketData.SIZE;
      for(let i = 0; i< this.numOfRecords; i++) {
        const md = MarketData.createInstance(i);
        md.update(buffer);
        this.marketDataList.push(md);
      }

      this.marketDataList.forEach(value => {
        this.marketDataMap.set(value.index, value);
      });

      this.agGrid.api.updateRowData({add: this.marketDataList});

  }

  refreshMarketData(): void {

    this.firstRow = this.agGrid.api.getFirstDisplayedRow();
    this.lastRow = this.agGrid.api.getLastDisplayedRow();
    this.totalDisplayedRows = this.agGrid.api.getDisplayedRowCount();

    for (let i = this.firstRow; i <= this.lastRow; i++) {
      const rowNode = this.agGrid.api.getDisplayedRowAtIndex(i);
      const key = rowNode.data.index;

      const md = this.marketDataMap.get(key);
      md.refresh();
    }
    this.agGrid.api.refreshCells();

  }

  onGridReady($event: any) {

    console.log('Grid Ready');
    this.agGrid.api.setRowData(this.marketDataList);

  }


}
