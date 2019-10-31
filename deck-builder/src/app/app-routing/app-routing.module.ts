import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DrawChanceComponent } from '../draw-chance/draw-chance.component';
import { DeckBuilderComponent } from '../deck-builder/deck-builder.component';
import { BuildDeckComponent } from '../deck-builder/select-hero/build-deck/build-deck.component';
import { MyDecksComponent } from '../my-decks/my-decks.component';
import { MyDecksEditComponent } from '../my-decks/my-decks-edit/my-decks-edit.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/deckbuilder', pathMatch: 'full' },
  { path: 'draw', component: DrawChanceComponent },
  {
    path: 'deckbuilder', component: DeckBuilderComponent
  },
  {
    path: 'builddeck/:heroClass/:isStandard', component: BuildDeckComponent
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
