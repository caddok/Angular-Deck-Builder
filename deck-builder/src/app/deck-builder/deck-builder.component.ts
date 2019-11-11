import { Component, OnInit } from '@angular/core';
import { DeckBuilderService } from './select-hero/build-deck/deck-builder.service';

@Component({
  selector: 'app-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.css']
})
export class DeckBuilderComponent implements OnInit {

  private apiTokenExpireTime: number;

  constructor(private deckService: DeckBuilderService) { }

  ngOnInit() {
    this.apiTokenExpireTime = +localStorage.getItem('apiTokenExpiresIn');
    if (new Date().getTime() >= this.apiTokenExpireTime || !localStorage.getItem('apiTokenExpiresIn')) {
      localStorage.setItem('apiToken', '');
      this.deckService.getAccessToken();
    }
  }

}
