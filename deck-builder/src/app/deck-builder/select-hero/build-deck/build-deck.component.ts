import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { DeckBuilderService } from './deck-builder.service';
import { HeroAssets } from 'src/app/shared/hero-assets.model';
import { FormControl } from '@angular/forms';

export class Mana {

  constructor(public cost: number, public selected?: boolean, public cardCount?: number) { }
}

@Component({
  selector: 'app-build-deck',
  templateUrl: './build-deck.component.html',
  styleUrls: ['./build-deck.component.css']
})
export class BuildDeckComponent implements OnInit {

  selectedHero: string;
  format: string;
  assets: HeroAssets;
  areClassCardsShown = true;
  areNeutralCardsShown = true;
  manaCosts = [new Mana(0, false), new Mana(1, false), new Mana(2, false), new Mana(3, false), new Mana(4, false),
  new Mana(5, false), new Mana(6, false), new Mana(7, false), new Mana(8, false), new Mana(9, false), new Mana(10, false)];
  search: FormControl;
  testCards = ['../../../../assets/images/rafaam.png', '../../../../assets/images/claw.png',
  '../../../../assets/images/defender.png', '../../../../assets/images/guardian.png', '../../../../assets/images/stag.png'];

  constructor(private route: ActivatedRoute, private deckService: DeckBuilderService) { }

  ngOnInit() {
    this.route.url.subscribe((value: UrlSegment[]) => {
      this.selectedHero = value[1].path;
      this.format = value[2].path;
      this.deckService.format = this.format;
      this.getHeroAssets(this.selectedHero);
    });
    this.search = new FormControl('');
  }

  private getHeroAssets(hero: string) {
    this.deckService.heroName = hero;
    this.assets = this.deckService.getHero();
  }

  onShowClassCards() {
    this.areClassCardsShown = !this.areClassCardsShown;
  }

  onShownNeutralCards() {
    this.areNeutralCardsShown = !this.areNeutralCardsShown;
  }

  onManaCostSelected(mana: Mana) {
    this.manaCosts[mana.cost].selected = !this.manaCosts[mana.cost].selected;
  }

  onSearchPhrase(event: any) {
    console.log(event.target.value);
  }
}
