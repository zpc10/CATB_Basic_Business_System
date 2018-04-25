import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { CoinsComponent } from './Coins/Coins.component';
import { ResourceComponent } from './Resource/Resource.component';
import { CashComponent } from './Cash/Cash.component';

import { OwnerComponent } from './Owner/Owner.component';
import { BankComponent } from './Bank/Bank.component';
import { CompanyComponent } from './Company/Company.component';

import { TransactionRRComponent } from './TransactionRR/TransactionRR.component';
import { TransactionRUComponent } from './TransactionRU/TransactionRU.component';
import { TransactionRBComponent } from './TransactionRB/TransactionRB.component';

import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,

    TransactionRRComponent,
    TransactionRUComponent,
    TransactionRBComponent,

    AllTransactionsComponent,

    OwnerComponent,
    BankComponent,
    CompanyComponent,

    CoinsComponent,
    ResourceComponent,		
    CashComponent
		
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
