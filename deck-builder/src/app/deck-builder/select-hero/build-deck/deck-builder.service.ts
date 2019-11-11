import { CardSearchResponse } from './deck-builder.service';
import { Injectable } from '@angular/core';
import { HeroAssets } from 'src/app/shared/models/hero-assets.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Card } from 'src/app/shared/models/card.model';
import { AuthApiResponse } from 'src/app/shared/interfaces/api-responses/auth-api-response';
import { CardApiResponse } from 'src/app/shared/interfaces/api-responses/card-api-response';
import { DeckBuilderUtils } from 'src/app/shared/utils/deck-builder.utils';
import { Subject } from 'rxjs';


export interface CardSearchResponse {
  cards: CardApiResponse[];
  cardCount: number;
  pageCount: number;
  page: number;
  isLegendary: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeckBuilderService {

  private assets = [
    new HeroAssets('../../../../assets/images/hero-headers/druid_header.jpg',
      '../../../../assets/images/Banners/druid_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_druid_banner.png', 'Druid',
      '../../../../assets/images/icons/druid_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/hunter_header.jpg',
      '../../../../assets/images/Banners/hunter_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_hunter_banner.png', 'Hunter',
      '../../../../assets/images/icons/hunter_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/mage_header.jpg',
      '../../../../assets/images/Banners/mage_banner2.png',
      '../../../../assets/images/DeckBanners/hearthstone_mage_banner.png', 'Mage',
      '../../../../assets/images/icons/mage_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/paladin_header.jpg',
      '../../../../assets/images/Banners/paladin_banner2.png',
      '../../../../assets/images/DeckBanners/hearthstone_paladin_banner.png', 'Paladin',
      '../../../../assets/images/icons/paladin_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/priest_header.jpg',
      '../../../../assets/images/Banners/priest_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_priest_banner.png', 'Priest',
      '../../../../assets/images/icons/priest_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/rogue_header.jpg',
      '../../../../assets/images/Banners/rogue_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_rogue_banner.png', 'Rogue',
      '../../../../assets/images/icons/rogue_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/shaman_header.jpg',
      '../../../../assets/images/Banners/shaman_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_shaman_banner.png', 'Shaman',
      '../../../../assets/images/icons/shaman_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/warlock_header.jpg',
      '../../../../assets/images/Banners/warlock_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_warlock_banner.png', 'Warlock',
      '../../../../assets/images/icons/warlock_class_icon.png'),
    new HeroAssets('../../../../assets/images/hero-headers/warrior_header.jpg',
      '../../../../assets/images/Banners/warrior_banner.png',
      '../../../../assets/images/DeckBanners/hearthstone_warrior_banner.png', 'Warrior',
      '../../../../assets/images/icons/warrior_class_icon.png'),
  ];
  private classCardsPage = 0;
  private neutralCardsPage = 0;
  selectedManaFilters: number[];
  builderUtils: DeckBuilderUtils = new DeckBuilderUtils();
  selectedCard: Subject<Card> = new Subject();
  isMaxCardCountReached = false;

  constructor(private http: HttpClient) { }

  private getAssets() {
    switch (localStorage.getItem('selectedHero')) {
      case 'Druid':
        return this.assets[0];
      case 'Hunter':
        return this.assets[1];
      case 'Mage':
        return this.assets[2];
      case 'Paladin':
        return this.assets[3];
      case 'Priest':
        return this.assets[4];
      case 'Rogue':
        return this.assets[5];
      case 'Shaman':
        return this.assets[6];
      case 'Warlock':
        return this.assets[7];
      case 'Warrior':
        return this.assets[8];
    }
  }

  getHero() {
    return this.getAssets();
  }

  getAccessToken() {
    this.http.post<AuthApiResponse>('https://eu.battle.net/oauth/token', null)
      .subscribe((response: AuthApiResponse) => {
        localStorage.setItem('apiToken', response.access_token);
        const expiresInMillis: string = '' + (new Date().getTime() + (+response.expires_in * 1000));
        localStorage.setItem('apiTokenExpiresIn', expiresInMillis);
      });
  }

  addManaFilter(manaCost: number) {
    this.selectedManaFilters.push(manaCost);
  }

  removeManaFilter(manaCost: number) {
    const index = this.selectedManaFilters.indexOf(manaCost);
    if (index > -1) {
      this.selectedManaFilters.splice(index, 1);
    }
  }

  getClassCards() {
    ++this.classCardsPage;
    return this.http.get<CardSearchResponse>('https://eu.api.blizzard.com/hearthstone/cards', {
      params: new HttpParams()
        .append('set', localStorage.getItem('selectedFormat'))
        .append('class', localStorage.getItem('selectedHero').toLowerCase())
        .append('page', '' + this.classCardsPage)
    }
    );
  }

  getNeutralCards() {
    ++this.neutralCardsPage;
    return this.http.get<CardSearchResponse>('https://eu.api.blizzard.com/hearthstone/cards', {
      params: new HttpParams()
        .append('set', localStorage.getItem('selectedFormat'))
        .append('class', 'neutral')
        .append('page', '' + this.neutralCardsPage)
    });
  }

  resetPageCounters() {
    this.classCardsPage = 0;
    this.neutralCardsPage = 0;
  }

  addCard(card: Card) {
    ++card.count;
    if (card.count > 0 && !this.isMaxCardCountReached) {
      card.isAdded = true;
      this.selectedCard.next(card);
    }
  }
}
