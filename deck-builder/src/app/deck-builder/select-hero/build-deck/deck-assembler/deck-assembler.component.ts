import { Component, OnInit } from '@angular/core';
import { DeckBuilderService } from '../deck-builder.service';
import { HeroAssets } from 'src/app/shared/hero-assets.model';
import { ChartOptions } from 'chart.js';
import { Mana } from '../build-deck.component';

@Component({
  selector: 'app-deck-assembler',
  templateUrl: './deck-assembler.component.html',
  styleUrls: ['./deck-assembler.component.css']
})
export class DeckAssemblerComponent implements OnInit {

  hero: HeroAssets;
  cardCount = 0;
  deckTitle: string;
  isMenuOpen = false;
  manaChartOptions: ChartOptions;
  zeroCostCount = 10;
  maxCardCount = 30;
  zerCost = new Mana(0, null, 0);
  manaCurve = [
    new Mana(1, null, 0),
    new Mana(2, null, 0),
    new Mana(3, null, 0),
    new Mana(4, null, 0),
    new Mana(5, null, 0),
    new Mana(6, null, 0),
    new Mana(7, null, 0)
  ];
  testCrops = [
    '../../../../../assets/images/crops/crop1.jpg',
    '../../../../../assets/images/crops/crop2.jpg',
    '../../../../../assets/images/crops/crop3.jpg',
    '../../../../../assets/images/crops/crop4.jpg',
    '../../../../../assets/images/crops/crop5.jpg'
  ];

  constructor(private deckService: DeckBuilderService) { }

  ngOnInit() {
    this.hero = this.deckService.getHero();
    console.log(this.hero.deckBanner);
    this.deckTitle = this.deckService.getFormat() + ' ' + this.hero.hero + ' ' + 'deck';
    this.manaChartOptions = {
      responsive: true,
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end'
        }
      }
    };
  }

  getFormatIcon() {
    if (this.deckService.getFormat() === 'standard') {
      return '../../../../../assets/images/formats/standard_deck_icon_small.png';
    } else {
      return '../../../../../assets/images/formats/wild_icon_small.png';
    }
  }

  onOpenManaCurve() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeToggleIcon() {
    if (this.isMenuOpen) {
      return '../../../../../assets/images/mana_curve_toggle_up.png';
    } else {
      return '../../../../../assets/images/mana_curve_toggle_down.png';
    }
  }

  calculateHeight(cardCount: number) {
    const height = (100 / this.maxCardCount) * cardCount;

    return height + '%';
  }
}
