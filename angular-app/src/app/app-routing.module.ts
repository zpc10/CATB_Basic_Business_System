import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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


const routes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'About', component: AboutComponent},
		
		{ path: 'Coins', component: CoinsComponent},		
		{ path: 'Resource', component: ResourceComponent},		
		{ path: 'Cash', component: CashComponent},

    { path: 'Owner', component: OwnerComponent},
    { path: 'Bank', component: BankComponent},
    { path: 'Company', component: CompanyComponent},

    { path: 'TransactionRR', component: TransactionRRComponent },
    { path: 'TransactionRU', component: TransactionRUComponent },
    { path: 'TransactionRB', component: TransactionRBComponent },

    { path: 'AllTransactions', component: AllTransactionsComponent },

		{path: '**', redirectTo:''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
