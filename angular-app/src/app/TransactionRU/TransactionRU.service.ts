import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Owner } from '../org.decentralized.resource.network';
import { Company } from '../org.decentralized.resource.network';

import { Coins } from '../org.decentralized.resource.network';
import { Resource } from '../org.decentralized.resource.network';

import { ResourceToCoins } from '../org.decentralized.resource.network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRUService {

	  private RESIDENT: string = 'Owner';
    private COMPANY: string = 'Company'; 
    private RESOURCE: string = 'Resource';
    private COINS: string = 'Coins';
    private RESOURCE_TO_COINS: string = 'ResourceToCoins';

    constructor(private ownerService: DataService<Owner>, private companyService: DataService<Company>, private coinsService: DataService<Coins>, private resourceService: DataService<Resource>, private resourceToCoinsService: DataService<ResourceToCoins>) {
    };

    //get all Owners
    public getAllOwners(): Observable<Owner[]> {
        return this.ownerService.getAll(this.RESIDENT);
    }

    //get all Companies
    public getAllCompanys(): Observable<Company[]> {
        return this.companyService.getAll(this.COMPANY);
    }

    //get Resource asset
    public getResource(id: any): Observable<Resource> {
      return this.resourceService.getSingle(this.RESOURCE, id);
    }

    //get Coins asset
    public getCoins(id: any): Observable<Coins> {
      return this.coinsService.getSingle(this.COINS, id);
    }
   
    //create Resource to Coins transaction
    public resourceToCoins(itemToAdd: any): Observable<ResourceToCoins> {
      return this.resourceToCoinsService.add(this.RESOURCE_TO_COINS, itemToAdd);
    }
 

}
