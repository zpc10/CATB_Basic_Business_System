import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OwnerService } from './Owner.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Owner',
	templateUrl: './Owner.component.html',
	styleUrls: ['./Owner.component.css'],
  	providers: [OwnerService]
})
export class OwnerComponent {

  myForm: FormGroup;

  private allOwners;
  private owner;
  private currentId;
  private errorMessage;

  private coins;
  private resource;
  private cash;

  
      ownerID = new FormControl("", Validators.required);
      firstName = new FormControl("", Validators.required);
      lastName = new FormControl("", Validators.required);
      coinsValue = new FormControl("", Validators.required);
      resourceValue = new FormControl("", Validators.required);
      resourceUnits = new FormControl("", Validators.required);
      cashValue = new FormControl("", Validators.required);
      cashCurrency = new FormControl("", Validators.required);
      
  

  constructor(private serviceOwner:OwnerService, fb: FormBuilder) {
    this.myForm = fb.group({
         
          ownerID:this.ownerID,
          firstName:this.firstName,      
          lastName:this.lastName,

          coinsValue:this.coinsValue,
          resourceValue:this.resourceValue,
          resourceUnits:this.resourceUnits,
          cashValue:this.cashValue,
          cashCurrency:this.cashCurrency
          
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }


  resetForm(): void{
    this.myForm.setValue({           
          "ownerID":null, 
          "firstName":null,       
          "lastName":null,

          "coinsValue":null,
          "resourceValue":null,
          "resourceUnits":null,
          "cashValue":null,
          "cashCurrency":null
      });
  }

  //allow update name of Owner
  updateOwner(form: any): Promise<any> {
    
    console.log("update check");
    this.owner = {
      $class: "org.decentralized.resource.network.Owner",          
            "firstName":this.firstName.value,          
            "lastName":this.lastName.value,

             "coins": "resource:org.decentralized.resource.network.Coins#CO_" + form.get("ownerID").value,
             "cash": "resource:org.decentralized.resource.network.Cash#CA_" + form.get("ownerID").value,
             "resource": "resource:org.decentralized.resource.network.Resource#EN_" + form.get("ownerID").value
    };
    console.log(this.owner);
    return this.serviceOwner.updateOwner(form.get("ownerID").value,this.owner)
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

  //delete Owner and the coins and cash assets associated to it
  deleteOwner(): Promise<any> {

    return this.serviceOwner.deleteOwner(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
      var coinsID = "CO_"+this.currentId;
      this.serviceOwner.deleteCoins(coinsID)
      .toPromise()
      .then(() => {
          this.serviceOwner.deleteResource("EN_"+this.currentId)
          .toPromise()
          .then(() => {
              this.serviceOwner.deleteCash("CA_"+this.currentId)
              .toPromise()
              .then(() => {
                  console.log("Deleted")
              });
          });
      });            
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

    return this.serviceOwner.getOwner(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {        
            "ownerID":null,          
            "firstName":null,          
            "lastName":null,

            "coinsValue":null,          
            "resourceValue":null,          
            "resourceUnits":null,          
            "cashValue":null,          
            "cashCurrency":null 
                      
      };

        if(result.ownerID){
          formObject.ownerID = result.ownerID;
        }else{
          formObject.ownerID = null;
        }
      
        if(result.firstName){
          formObject.firstName = result.firstName;
        }else{
          formObject.firstName = null;
        }
      
        if(result.lastName){
          formObject.lastName = result.lastName;
        }else{
          formObject.lastName = null;
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


  loadAll_OnlyOwners(): Promise<any> {
    let tempList = [];
    return this.serviceOwner.getAllOwners()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(owner => {
        tempList.push(owner);
      });
      this.allOwners = tempList;
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

  //load all Owner and the enregy, coins and cash assets associated to it 
  loadAll(): Promise<any>  {
    
    //retrieve all owners
    let ownerList = [];
    return this.serviceOwner.getAllOwners()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(owner => {
        ownerList.push(owner);
      });     
    })
    .then(() => {

      for (let owner of ownerList) {
        console.log("in for loop")
        console.log(owner.coins)

        var splitted_coinsID = owner.coins.split("#", 2); 
        var coinsID = String(splitted_coinsID[1]);
        this.serviceOwner.getCoins(coinsID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value){
            owner.coinsValue = result.value;
          }
        });

        var splitted_resourceID = owner.resource.split("#", 2); 
        var resourceID = String(splitted_resourceID[1]);
        console.log(resourceID);
        this.serviceOwner.getResource(resourceID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value){
            owner.resourceValue = result.value;
          }
          if(result.units){
            owner.resourceUnits = result.units;
          }
        });

        var splitted_cashID = owner.cash.split("#", 2); 
        var cashID = String(splitted_cashID[1]);
        console.log(cashID);
        this.serviceOwner.getCash(cashID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value){
            owner.cashValue = result.value;
          }
          if(result.currency){
            owner.cashCurrency = result.currency;
          }
        });
      }

      this.allOwners = ownerList;
    });

  }

  //add Owner participant
  addOwner(form: any): Promise<any> {

    return this.createAssetsOwner()
      .then(() => {           
        this.errorMessage = null;
        this.myForm.setValue({
            "ownerID":null,
            "firstName":null,
            "lastName":null,
            "coinsValue":null,
            "resourceValue":null,
            "resourceUnits":null,
            "cashValue":null,
            "cashCurrency":null
        });
      })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.errorMessage = "Input error";
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //create coins, resource and cash assets associated with the Owner, followed by the Owner
  createAssetsOwner(): Promise<any> {

    this.coins = {
      $class: "org.decentralized.resource.network.Coins",
          "coinsID":"CO_" + this.ownerID.value,
          "value":this.coinsValue.value,
          "ownerID":this.ownerID.value,
          "ownerEntity":'Owner'
    };
    
    this.resource = {
      $class: "org.decentralized.resource.network.Resource",
          "resourceID":"EN_" + this.ownerID.value,
          "units":this.resourceUnits.value,
          "value":this.resourceValue.value,
          "ownerID":this.ownerID.value,
          "ownerEntity":'Owner'        
    };

    this.cash = {
      $class: "org.decentralized.resource.network.Cash",
          "cashID":"CA_" + this.ownerID.value,
          "currency":this.cashCurrency.value,
          "value":this.cashValue.value,
          "ownerID":this.ownerID.value,
          "ownerEntity":'Owner'        
    };    
    
    this.owner = {
      $class: "org.decentralized.resource.network.Owner",
          "ownerID":this.ownerID.value,
          "firstName":this.firstName.value,
          "lastName":this.lastName.value,

          "coins":"CO_" + this.ownerID.value,
          "cash":"CA_" + this.ownerID.value,
          "resource":"EN_" + this.ownerID.value,

      };    

    return this.serviceOwner.addCoins(this.coins)
    .toPromise()
		.then(() => {
      console.log("create resource");
			this.serviceOwner.addResource(this.resource)
      .toPromise()
		  .then(() => {
        console.log("create cash");
        this.serviceOwner.addCash(this.cash)
        .toPromise()
        .then(() => {
          console.log("create owners");
          this.serviceOwner.addOwner(this.owner)
          .toPromise()
          .then(() => {
           console.log("created assets");
           location.reload();
            });            
        });
		  });   
		});
  }
}





