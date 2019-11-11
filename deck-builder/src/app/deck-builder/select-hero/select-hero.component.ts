import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DeckBuilderService } from './build-deck/deck-builder.service';

export class HeroPortrait {

  constructor(public portraitLocation: string, public className: string) { }
}

@Component({
  selector: 'app-select-hero',
  templateUrl: './select-hero.component.html',
  styleUrls: ['./select-hero.component.css']
})
export class SelectHeroComponent implements OnInit {

  deckString: FormControl;
  isStandardFormat = true;
  selectedHero: string;

  heroPortraits = [
    new HeroPortrait('../../../assets/images/heroes/druid_hero_image.png', 'Druid'),
    new HeroPortrait('../../../assets/images/heroes/hunter_hero_image.png', 'Hunter'),
    new HeroPortrait('../../../assets/images/heroes/mage_hero_image.png', 'Mage'),
    new HeroPortrait('../../../assets/images/heroes/paladin_hero_image.png', 'Paladin'),
    new HeroPortrait('../../../assets/images/heroes/priest_hero_image.png', 'Priest'),
    new HeroPortrait('../../../assets/images/heroes/rogue_hero_image.png', 'Rogue'),
    new HeroPortrait('../../../assets/images/heroes/shaman_hero_image.png', 'Shaman'),
    new HeroPortrait('../../../assets/images/heroes/warlock_hero_image.png', 'Warlock'),
    new HeroPortrait('../../../assets/images/heroes/warrior_hero_image.png', 'Warrior')
  ];

  constructor(private router: Router, private deckService: DeckBuilderService) { }

  ngOnInit() {
    this.deckString = new FormControl('', [Validators.required]);
  }

  onDeckStringSubmit(event: any) {
    console.log(this.deckString.value);
  }

  onChangeToStandard() {
    this.isStandardFormat = true;
    console.log(this.isStandardFormat);
  }

  onChangeToWild() {
    this.isStandardFormat = false;
    console.log(this.isStandardFormat);
  }

  onHeroSelected(className: string) {
    localStorage.setItem('selectedFormat', this.isStandardFormat ? 'standard' : 'wild');
    localStorage.setItem('selectedHero', className);
    // this.deckService.format = this.isStandardFormat ? 'standard' : 'wild';
    // this.deckService.heroName = className;
    this.router.navigate(['builddeck', className, this.isStandardFormat ? 'standard' : 'wild']);
  }
}
