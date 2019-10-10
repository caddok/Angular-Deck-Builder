import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NewsComponent } from '../news/news.component';
import { NewsArticleComponent } from '../news/news-article/news-article.component';
import { DrawChanceComponent } from '../draw-chance/draw-chance.component';
import { DeckBuilderComponent } from '../deck-builder/deck-builder.component';
import { SelectHeroComponent } from '../deck-builder/select-hero/select-hero.component';
import { BuildDeckComponent } from '../deck-builder/select-hero/build-deck/build-deck.component';
import { MyDecksComponent } from '../my-decks/my-decks.component';
import { MyDecksEditComponent } from '../my-decks/my-decks-edit/my-decks-edit.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  {
    path: 'news', component: NewsComponent, children: [
      { path: ':title', component: NewsArticleComponent }
    ]
  },
  { path: 'draw', component: DrawChanceComponent },
  {
    path: 'deckbuilder', component: DeckBuilderComponent, children: [
      { path: 'select', component: SelectHeroComponent },
      { path: ':heroName', component: BuildDeckComponent }
    ]
  },
  {
    path: 'mydecks', component: MyDecksComponent, children: [
      { path: ':id/edit', component: MyDecksEditComponent }
    ]
  },
  {
    path: 'auth', children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
