import * as ByteBuffer from 'bytebuffer'
import { BufferUtils } from './BufferUtils';

export class MarketData {

  public static SIZE: 216;
  public symbol: string;
  public symbolId: bigint;
  public mid: number;
  public askPrice0: number;
  public askPrice1: number;
  public askPrice2: number;
  public askPrice3: number;
  public askPrice4: number;

  public askSize0: number;
  public askSize1: number;
  public askSize2: number;
  public askSize3: number;
  public askSize4: number;


  public bidPrice0: number;
  public bidPrice1: number;
  public bidPrice2: number;
  public bidPrice3: number;
  public bidPrice4: number;

  public bidSize0: number;
  public bidSize1: number;
  public bidSize2: number;
  public bidSize3: number;
  public bidSize4: number;
  private dataView: DataView;



  constructor(arrayBuffer: ArrayBuffer = null){
    if( arrayBuffer !== null) {
      this.dataView = new DataView(arrayBuffer);
    }
  }

  public static createInstance(): MarketData {
    return new MarketData();

  }
  public update(arrayBuffer: SharedArrayBuffer){
    this.dataView = new DataView(arrayBuffer);

  }



  public refresh(): void {
    this.updateFields();
  }

  private updateFields() {


    this.symbol = BufferUtils.BufferToStringASCII(this.dataView.buffer,40);
    this.symbolId = this.dataView.getBigInt64(40, true);
    this.mid = this.dataView.getFloat64(48, true);

  }

  public toString() : string {
    return 'MarketData : { Symbol: ' + this.symbol +
      ' Id:' + this.symbolId +
      ' Mid:' + this.mid   +
      ' AskPrice0:' + this.askPrice0   +
      ' AskPrice1:' + this.askPrice1   +
      ' AskPrice2:' + this.askPrice2   +
      ' AskPrice3:' + this.askPrice3   +
      ' AskPrice4:' + this.askPrice4   +

      ' BidPrice0:' + this.bidPrice0   +
      ' BidPrice1:' + this.bidPrice1   +
      ' BidPrice2:' + this.bidPrice2   +
      ' BidPrice3:' + this.bidPrice3   +
      ' BidPrice4:' + this.bidPrice4   +

      ' AskSize0:' + this.askSize0 +
      ' AskSize1:' + this.askSize1 +
      ' AskSize2:' + this.askSize2 +
      ' AskSize3:' + this.askSize3 +
      ' AskSize4:' + this.askSize4 +

      ' BidSize0:' + this.bidSize0 +
      ' BidSize1:' + this.bidSize1 +
      ' BidSize2:' + this.bidSize2 +
      ' BidSize3:' + this.bidSize3 +
      ' BidSize4:' + this.bidSize4 +


      '}'
  }

}


