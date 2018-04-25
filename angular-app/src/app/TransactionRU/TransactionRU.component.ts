import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { TransactionRUService } from './TransactionRU.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-TransactionRU',
	templateUrl: './TransactionRU.component.html',
	styleUrls: ['./TransactionRU.component.css'],
  	providers: [TransactionRUService]
})
export class TransactionRUComponent {

  //defined rate
  private utilityCoinsPerResource = 1;
  private utilityResourcePerCoins = (1 / this.utilityCoinsPerResource).toFixed(3);  
  private coinsExchanged;
  
  private resourceValue;


  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allOwners;
  private allCompanys;

  private owner;
  private companys;
  
  private resourceToCoinsObj;

  private transactionID;

  private resourceReceiverAsset;
  private resourceProducerAsset;  
  private coinsCreditAsset;
  private coinsDebitAsset;

    formOwnerID = new FormControl("", Validators.required);
	  formUtilityID = new FormControl("", Validators.required); 
    action = new FormControl("", Validators.required); 
	  value = new FormControl("", Validators.required);
  
  constructor(private serviceTransaction:TransactionRUService, fb: FormBuilder) {
      
	  this.myForm = fb.group({
		  
		  formOwnerID:this.formOwnerID,
		  formUtilityID:this.formUtilityID,
      action:this.action,
      value:this.value,
      
    });
    
  };

  ngOnInit(): void {
    this.transactionFrom  = true;
    this.loadAllOwners()
    .then(() => {                     
            this.loadAllCompanys();
    });
    
  }

  //get all Owners
  loadAllOwners(): Promise<any> {
    let tempList = [];
    return this.serviceTransaction.getAllOwners()
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

  //get all Companies
  loadAllCompanys(): Promise<any> {
    let tempList = [];
    return this.serviceTransaction.getAllCompanys()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(company => {
        tempList.push(company);
      });
      this.allCompanys = tempList;
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

  //execute transaction
  execute(form: any): Promise<any> {
          
    console.log(this.allOwners)
    console.log(this.allCompanys)

    //get owner
    for (let owner of this.allOwners) {
      console.log(owner.ownerID);       
      if(owner.ownerID == this.formOwnerID.value){
        this.owner = owner;
      }     
    }

    //get utility company
    for (let company of this.allCompanys) {
        console.log(company.utilityID); 
      
      if(company.utilityID == this.formUtilityID.value){
        this.companys = company;
      }     
    }

    console.log('Action: ' + this.action.value)

    //depending on action, identify resource and coins assets to be debited/credited
    if(this.action.value == 'buyResource') {

        this.resourceValue = this.value.value;

        this.resourceReceiverAsset = this.owner.resource;
        this.resourceProducerAsset = this.companys.resource;  
        this.coinsCreditAsset = this.companys.coins;
        this.coinsDebitAsset = this.owner.coins;
    }
    else if(this.action.value == 'sellResource') {

        this.resourceValue = this.value.value;

        this.resourceReceiverAsset = this.companys.resource;
        this.resourceProducerAsset = this.owner.resource;  
        this.coinsCreditAsset = this.owner.coins;
        this.coinsDebitAsset = this.companys.coins;
    }
    

    console.log('Producer Resource ID ' + this.resourceProducerAsset);
    console.log('Producer Coins ID ' + this.coinsCreditAsset);
    console.log('Consumer Resource ID ' + this.resourceReceiverAsset);
    console.log('Consumer Coins ID ' + this.coinsDebitAsset);

    //identify resource and coins id which will be debited
    var splitted_resourceID = this.resourceProducerAsset.split("#", 2); 
    var resourceID = String(splitted_resourceID[1]);

    var splitted_coinsID = this.coinsDebitAsset.split("#", 2); 
    var coinsID = String(splitted_coinsID[1]);
        
    this.coinsExchanged = this.utilityCoinsPerResource * this.resourceValue;

    //transaction object
    this.resourceToCoinsObj = {
      $class: "org.decentralized.resource.network.ResourceToCoins",
      "resourceRate": this.utilityCoinsPerResource,
      "resourceValue": this.resourceValue,
      "coinsInc": this.coinsCreditAsset,
      "coinsDec": this.coinsDebitAsset,
      "resourceInc": this.resourceReceiverAsset,
      "resourceDec": this.resourceProducerAsset
    };

    //check coins and resource assets for enough funds before creating transaction
    return this.serviceTransaction.getResource(resourceID)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      if(result.value) {
        if ((result.value - this.resourceValue) < 0 ){          
          this.errorMessage = "Insufficient resource in producer account";
          return false;
        }
        return true;
      }
    })
    .then((checkProducerResource) => {
      console.log('checkResource: ' + checkProducerResource)
      if(checkProducerResource)
      {        
        this.serviceTransaction.getCoins(coinsID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value) {
            if ((result.value - this.coinsExchanged) < 0 ){
              
              this.errorMessage = "Insufficient coins in consumer account";
              return false;
            }
            return true;
          }
        })
        .then((checkConsumerCoins) => {
          console.log('checkConsumerCoins: ' + checkConsumerCoins)
          if(checkConsumerCoins)
          {
            this.serviceTransaction.resourceToCoins(this.resourceToCoinsObj)
            .toPromise()
            .then((result) => {
              this.errorMessage = null;
              this.transactionID = result.transactionId;
              console.log(result);
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
            }).then(() => {
              this.transactionFrom = false;
            });
          }
        });
      }        
    });
  }        
}
