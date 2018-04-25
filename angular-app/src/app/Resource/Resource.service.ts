import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Resource } from '../org.decentralized.resource.network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class ResourceService {

	
		private NAMESPACE: string = 'Resource';
	



    constructor(private dataService: DataService<Resource>) {
    };

    public getAll(): Observable<Resource[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Resource> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Resource> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Resource> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Resource> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
