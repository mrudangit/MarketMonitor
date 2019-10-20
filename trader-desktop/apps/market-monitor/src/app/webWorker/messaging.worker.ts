/// <reference lib="webworker" />

import { MarketDataService } from '../services/market-data.service';
import { MarketData } from '../models/MarketData';

let marketDataService;

addEventListener('message', ({ data }) => {
  console.log('Message : ', data);
  if( data === 'start') {
    marketDataService = new MarketDataService();
  }

  if( data === 'stop'){
    marketDataService.closeConnection();
  }
});
