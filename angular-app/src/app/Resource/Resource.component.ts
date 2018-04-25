import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ResourceService } from './Resource.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Source',
	templateUrl: './Resource.component.html',
	styleUrls: ['./Resource.component.css'],
  providers: [ResourceService]
})
export class ResourceComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      resourceID = new FormControl("", Validators.required);
      units = new FormControl("", Validators.required);
      value = new FormControl("", Validators.required);
      ownerID = new FormControl("", Validators.required);
      ownerEntity = new FormControl("", Validators.required);
  

  constructor(private serviceResource:ResourceService, fb: FormBuilder) {
    this.myForm = fb.group({
          resourceID:this.resourceID,
          units:this.units,
          value:this.value,
          ownerID:this.ownerID,
          ownerEntity:this.ownerEntity
        
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceResource.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  addAsset(form: any): Promise<any> {

    this.asset = {
      $class: "org.decentralized.resource.network.Resource",
          "resourceID":this.resourceID.value,
          "units":this.units.value,
          "value":this.value.value,
          "ownerID":this.ownerID.value,
          "ownerEntity":this.ownerEntity.value        
    };

    this.myForm.setValue({      
          "resourceID":null,
          "units":null,
          "value":null,
          "ownerID":null,
          "ownerEntity":null
    });

    return this.serviceResource.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
          "resourceID":null,
          "units":null,
          "value":null,
          "ownerID":null,
          "ownerEntity":null 
        
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.decentralized.resource.network.Resource",
            "units":this.units.value,
            "value":this.value.value,
            "ownerID":this.ownerID.value,
            "ownerEntity":this.ownerEntity.value
    };

    return this.serviceResource.updateAsset(form.get("resourceID").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceResource.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceResource.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
            "resourceID":null,
            "units":null,
            "value":null,
            "ownerID":null,
            "ownerEntity":null 
      };
      
        if(result.resourceID){
          formObject.resourceID = result.resourceID;
        }else{
          formObject.resourceID = null;
        }
      
        if(result.units){
          formObject.units = result.units;
        }else{
          formObject.units = null;
        }
      
        if(result.value){
          formObject.value = result.value;
        }else{
          formObject.value = null;
        }
      
        if(result.ownerID){
          formObject.ownerID = result.ownerID;
        }else{
          formObject.ownerID = null;
        }
      
        if(result.ownerEntity){
          formObject.ownerEntity = result.ownerEntity;
        }else{
          formObject.ownerEntity = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
          "resourceID":null,
          "units":null,
          "value":null,
          "ownerID":null,
          "ownerEntity":null 
      });
  }

}
