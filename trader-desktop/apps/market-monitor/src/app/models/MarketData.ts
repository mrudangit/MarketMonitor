import * as ByteBuffer from 'bytebuffer'
import { BufferUtils } from './BufferUtils';

export class MarketData {

  public static SIZE = 236;

  public static INDEX_OFFSET=0;
  public static SYMBOL_OFFSET=4;
  public static SYMBOL_ID_OFFSET=44;
  public static MID_OFFSET=52;

  public static ASKPRICE0_OFFSET=60;
  public static ASKPRICE1_OFFSET=68;
  public static ASKPRICE2_OFFSET=76;
  public static ASKPRICE3_OFFSET=84;
  public static ASKPRICE4_OFFSET=92;

  public static BIDPRICE0_OFFSET=100;
  public static BIDPRICE1_OFFSET=108;
  public static BIDPRICE2_OFFSET=116;
  public static BIDPRICE3_OFFSET=124;
  public static BIDPRICE4_OFFSET=132;

  public static ASKSIZE0_OFFSET=140;
  public static ASKSIZE1_OFFSET=148;
  public static ASKSIZE2_OFFSET=156;
  public static ASKSIZE3_OFFSET=164;
  public static ASKSIZE4_OFFSET=172;


  public static BIDSIZE0_OFFSET=180;
  public static BIDSIZE1_OFFSET=188;
  public static BIDSIZE2_OFFSET=196;
  public static BIDSIZE3_OFFSET=204;
  public static BIDSIZE4_OFFSET=212;


  public static REVISIONID_OFFSET = 220;
  public static SPREAD_OFFSET = 228;

  public readonly index: number;
  public symbol: string;
  public symbolId: bigint;
  public mid: number;
  public askPrice0: number;
  public askPrice1: number;
  public askPrice2: number;
  public askPrice3: number;
  public askPrice4: number;

  public askSize0: bigint;
  public askSize1: bigint;
  public askSize2: bigint;
  public askSize3: bigint;
  public askSize4: bigint;


  public bidPrice0: number;
  public bidPrice1: number;
  public bidPrice2: number;
  public bidPrice3: number;
  public bidPrice4: number;

  public bidSize0: bigint;
  public bidSize1: bigint;
  public bidSize2: bigint;
  public bidSize3: bigint;
  public bidSize4: bigint;


  public revisionId: bigint;
  public spread: number;

  private dataView: DataView;



  constructor(index: number,arrayBuffer: ArrayBuffer = null){
    this.index = index;
    if( arrayBuffer !== null) {
      this.dataView = new DataView(arrayBuffer);
    }
  }

  public static createInstance(index: number): MarketData {
    return new MarketData(index);

  }
  public update(arrayBuffer: SharedArrayBuffer){
    this.dataView = new DataView(arrayBuffer, this.index* MarketData.SIZE);

  }



  public refresh(): void {
    this.updateFields();
  }

  private updateFields() {

    const strOffset = this.index*MarketData.SIZE;
    this.symbol = BufferUtils.BufferToStringASCII(this.dataView.buffer,strOffset+ 4,40);
    this.symbolId = this.dataView.getBigInt64(MarketData.SYMBOL_ID_OFFSET, true);
    this.mid = this.dataView.getFloat64(MarketData.MID_OFFSET, true);

    this.askPrice0 = this.dataView.getFloat64(MarketData.ASKPRICE0_OFFSET, true);
    this.askPrice1 = this.dataView.getFloat64(MarketData.ASKPRICE1_OFFSET, true);
    this.askPrice2 = this.dataView.getFloat64(MarketData.ASKPRICE2_OFFSET, true);
    this.askPrice3 = this.dataView.getFloat64(MarketData.ASKPRICE3_OFFSET, true);
    this.askPrice4 = this.dataView.getFloat64(MarketData.ASKPRICE4_OFFSET, true);

    this.bidPrice0 = this.dataView.getFloat64(MarketData.BIDPRICE0_OFFSET, true);
    this.bidPrice1 = this.dataView.getFloat64(MarketData.BIDPRICE1_OFFSET, true);
    this.bidPrice2 = this.dataView.getFloat64(MarketData.BIDPRICE2_OFFSET, true);
    this.bidPrice3 = this.dataView.getFloat64(MarketData.BIDPRICE3_OFFSET, true);
    this.bidPrice4 = this.dataView.getFloat64(MarketData.BIDPRICE4_OFFSET, true);

    this.askSize0 = this.dataView.getBigInt64(MarketData.ASKSIZE0_OFFSET, true);
    this.askSize1 = this.dataView.getBigInt64(MarketData.ASKSIZE1_OFFSET, true);
    this.askSize2 = this.dataView.getBigInt64(MarketData.ASKSIZE2_OFFSET, true);
    this.askSize3 = this.dataView.getBigInt64(MarketData.ASKSIZE3_OFFSET, true);
    this.askSize4 = this.dataView.getBigInt64(MarketData.ASKSIZE4_OFFSET, true);

    this.bidSize0 = this.dataView.getBigInt64(MarketData.BIDSIZE0_OFFSET, true);
    this.bidSize1 = this.dataView.getBigInt64(MarketData.BIDSIZE1_OFFSET, true);
    this.bidSize2 = this.dataView.getBigInt64(MarketData.BIDSIZE2_OFFSET, true);
    this.bidSize3 = this.dataView.getBigInt64(MarketData.BIDSIZE3_OFFSET, true);
    this.bidSize4 = this.dataView.getBigInt64(MarketData.BIDSIZE4_OFFSET, true);

    this.revisionId = this.dataView.getBigInt64(MarketData.REVISIONID_OFFSET, true);
    this.spread = this.dataView.getFloat64(MarketData.SPREAD_OFFSET, true);



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


