import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Owner } from '../org.decentralized.resource.network';


import { Cash } from '../org.decentralized.resource.network';
import { Coins } from '../org.decentralized.resource.network';
import { Resource } from '../org.decentralized.resource.network';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class OwnerService {

	
		private OWNER: string = 'Owner';  
    private COINS: string = 'Coins';
    private RESOURCE: string = 'Resource';
    private CASH: string = 'Cash';
	
    constructor(private ownerService: DataService<Owner>, private coinsService: DataService<Coins>, private resourceService: DataService<Resource>, private cashService: DataService<Cash>) {
    };

    //owner functions
    public getAllOwners(): Observable<Owner[]> {
        return this.ownerService.getAll(this.OWNER);
    }

    public getOwner(id: any): Observable<Owner> {
      return this.ownerService.getSingle(this.OWNER, id);
    }

    public addOwner(itemToAdd: any): Observable<Owner> {
      return this.ownerService.add(this.OWNER, itemToAdd);
    }

    public deleteOwner(id: any): Observable<Owner> {
      return this.ownerService.delete(this.OWNER, id);
    }

    public updateOwner(id: any, itemToUpdate: any): Observable<Owner> {
      return this.ownerService.update(this.OWNER, id, itemToUpdate);
    }


    //coins functions
    public getAllCoins(): Observable<Coins[]> {
        return this.coinsService.getAll(this.COINS);
    }

    public getCoins(id: any): Observable<Coins> {
      return this.coinsService.getSingle(this.COINS, id);
    }

    public addCoins(itemToAdd: any): Observable<Coins> {
      return this.coinsService.add(this.COINS, itemToAdd);
    }

    public updateCoins(id: any, itemToUpdate: any): Observable<Coins> {
      return this.coinsService.update(this.COINS, id, itemToUpdate);
    }

    public deleteCoins(id: any): Observable<Coins> {
      console.log(id)
      return this.coinsService.delete(this.COINS, id);
    }


    //energy functions
    public getAllResource(): Observable<Resource[]> {
        return this.resourceService.getAll(this.RESOURCE);
    }

    public getResource(id: any): Observable<Resource> {
      return this.resourceService.getSingle(this.RESOURCE, id);
    }

    public addResource(itemToAdd: any): Observable<Resource> {
      return this.resourceService.add(this.RESOURCE, itemToAdd);
    }

    public updateResource(id: any, itemToUpdate: any): Observable<Resource> {
      return this.resourceService.update(this.RESOURCE, id, itemToUpdate);
    }

    public deleteResource(id: any): Observable<Resource> {
      return this.resourceService.delete(this.RESOURCE, id);
    }


    //cash functions
    public getAllCash(): Observable<Cash[]> {
        return this.cashService.getAll(this.CASH);
    }

    public getCash(id: any): Observable<Cash> {
      return this.cashService.getSingle(this.CASH, id);
    }

    public addCash(itemToAdd: any): Observable<Cash> {
      return this.cashService.add(this.CASH, itemToAdd);
    }

    public updateCash(id: any, itemToUpdate: any): Observable<Cash> {
      return this.cashService.update(this.CASH, id, itemToUpdate);
    }

    public deleteCash(id: any): Observable<Cash> {
      console.log(id)
      return this.cashService.delete(this.CASH, id);
    }

}
