import { Injectable } from '@angular/core';
import { HeroAssets } from 'src/app/shared/hero-assets.model';

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
  heroName: string;
  format: string;
  private hero: HeroAssets;

  constructor() { }

  private getAssets() {
    switch (this.heroName) {
      case 'Druid':
        this.hero = this.assets[0];
        break;
      case 'Hunter':
        this.hero = this.assets[1];
        break;
      case 'Mage':
        this.hero = this.assets[2];
        break;
      case 'Paladin':
        this.hero = this.assets[3];
        break;
      case 'Priest':
        this.hero = this.assets[4];
        break;
      case 'Rogue':
        this.hero = this.assets[5];
        break;
      case 'Shaman':
        this.hero = this.assets[6];
        break;
      case 'Warlock':
        this.hero = this.assets[7];
        break;
      case 'Warrior':
        this.hero = this.assets[8];
        break;
    }
  }

  getHero() {
    this.getAssets();
    return this.hero;
  }

  getFormat() {
    return this.format;
  }
}
