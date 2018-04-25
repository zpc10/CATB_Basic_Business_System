import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Company } from '../org.decentralized.resource.network';

import { Coins } from '../org.decentralized.resource.network';
import { Resource } from '../org.decentralized.resource.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class CompanyService {

	
		private COMPANY: string = 'Company';  
    private COINS: string = 'Coins';
    private RESOURCE: string = 'Resource';
	
    constructor(private companyService: DataService<Company>, private coinsService: DataService<Coins>, private resourceService: DataService<Resource>) {
    };

    //company functions
    public getAllCompanys(): Observable<Company[]> {
        return this.companyService.getAll(this.COMPANY);
    }

    public getCompany(id: any): Observable<Company> {
      return this.companyService.getSingle(this.COMPANY, id);
    }

    public addCompany(itemToAdd: any): Observable<Company> {
      return this.companyService.add(this.COMPANY, itemToAdd);
    }

    public deleteCompany(id: any): Observable<Company> {
      return this.companyService.delete(this.COMPANY, id);
    }

    public updateCompany(id: any, itemToUpdate: any): Observable<Company> {
      return this.companyService.update(this.COMPANY, id, itemToUpdate);
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


    //resource functions
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

}
