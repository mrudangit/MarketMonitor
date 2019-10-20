import { Component } from '@angular/core';
import { MarketData } from './models/MarketData';
import { WorkerMessage, WorkerMessageEnum } from './models/WorkerMessage';

@Component({
  selector: 'trader-desktop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'market-monitor';
  private messagingWorker: Worker;
  private marketData: MarketData;
  constructor(){

    this.messagingWorker =  new Worker('./webWorker/messaging.worker.ts', {name:'messaging', type: 'module' });

    this.messagingWorker.addEventListener('message', ev => {
      this.processMessage(ev);
    });

  }

  startSubscribing($event: MouseEvent) {
    if (typeof  window !== undefined){
      console.log('We are in Main App');
    }
    this.messagingWorker.postMessage('start');
  }

  stopSubscribing($event: MouseEvent) {

    this.messagingWorker.postMessage('stop');
  }

  private processMessage(event: MessageEvent) {

    console.log('Event From Worker : ', event);


    const workerMessage: WorkerMessage = event.data;

    if( workerMessage.msgType === WorkerMessageEnum.SHARED_BUFFER_SNAPSHOT) {

      const buffer: SharedArrayBuffer = workerMessage.payLoad;
      this.marketData = MarketData.createInstance();
      this.marketData.update(buffer);
      console.log(this.marketData.toString());
    }
    if(workerMessage.msgType === WorkerMessageEnum.SHARED_BUFFER_UPDATE){
      this.marketData.refresh();
      console.log(this.marketData.toString());
    }
  }
}
