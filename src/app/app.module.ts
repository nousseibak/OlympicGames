import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NgChartsModule } from 'ng2-charts';
import { Titre2Component } from './core/components/titre2/titre2.component';
import { Titre1Component } from './core/components/titre1/titre1.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

library.add(faMedal);

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, DetailComponent, Titre2Component, Titre1Component, HeaderComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgChartsModule, FontAwesomeModule,],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
