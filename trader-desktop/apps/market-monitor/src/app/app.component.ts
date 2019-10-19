import { Component } from '@angular/core';
import { MarketDataService } from './services/market-data.service';

@Component({
  selector: 'trader-desktop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'market-monitor';
  constructor(private marketDataService: MarketDataService){

  }
}
