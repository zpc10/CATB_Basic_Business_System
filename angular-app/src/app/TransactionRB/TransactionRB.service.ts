import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Owner } from '../org.decentralized.resource.network';
import { Bank } from '../org.decentralized.resource.network';

import { Coins } from '../org.decentralized.resource.network';
import { Cash } from '../org.decentralized.resource.network';

import { CashToCoins } from '../org.decentralized.resource.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRBService {

	  private RESIDENT: string = 'Owner';
    private BANK: string = 'Bank'; 
    private CASH: string = 'Cash';
    private COINS: string = 'Coins';
    private CASH_TO_COINS: string = 'CashToCoins';

    constructor(private ownerService: DataService<Owner>, private bankService: DataService<Bank>, private coinsService: DataService<Coins>, private cashService: DataService<Cash>, private cashToCoinsService: DataService<CashToCoins>) {
    };

    //get all Owners
    public getAllOwners(): Observable<Owner[]> {
        return this.ownerService.getAll(this.RESIDENT);
    }

    //get all Banks
    public getAllBanks(): Observable<Bank[]> {
        return this.bankService.getAll(this.BANK);
    }

    //get Cash asset
    public getCash(id: any): Observable<Cash> {
      return this.cashService.getSingle(this.CASH, id);
    }

    //get Coins asset
    public getCoins(id: any): Observable<Coins> {
      return this.coinsService.getSingle(this.COINS, id);
    }
   
    //create Cash to Coins transaction
    public cashToCoins(itemToAdd: any): Observable<CashToCoins> {
      return this.cashToCoinsService.add(this.CASH_TO_COINS, itemToAdd);
    }

}
