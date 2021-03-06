import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeckBuilderComponent } from './deck-builder/deck-builder.component';
import { MaterialComponentsModule } from './material-components/material-components.module';
import { HeaderComponent } from './header/header.component';
import { NewsComponent } from './news/news.component';
import { DrawChanceComponent } from './draw-chance/draw-chance.component';
import { SelectHeroComponent } from './deck-builder/select-hero/select-hero.component';
import { BuildDeckComponent } from './deck-builder/select-hero/build-deck/build-deck.component';
import { NewsArticleComponent } from './news/news-article/news-article.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MyDecksComponent } from './my-decks/my-decks.component';
import { MyDecksEditComponent } from './my-decks/my-decks-edit/my-decks-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewsComponent,
    DeckBuilderComponent,
    SelectHeroComponent,
    BuildDeckComponent,
    DrawChanceComponent,
    NewsArticleComponent,
    MyDecksComponent,
    MyDecksEditComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    MaterialComponentsModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
