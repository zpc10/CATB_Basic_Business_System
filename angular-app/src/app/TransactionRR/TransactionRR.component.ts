import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { TransactionRRService } from './TransactionRR.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-TransactionRR',
	templateUrl: './TransactionRR.component.html',
	styleUrls: ['./TransactionRR.component.css'],
  	providers: [TransactionRRService]
})
export class TransactionRRComponent {

  //defined rate
  private ownerCoinsPerResource = 1;
  private ownerResourcePerCoin = (1 / this.ownerCoinsPerResource).toFixed(2);  
  private coinsExchanged;
  private checkResultProducerResource = true;
  private checkResultConsumerCoins = true;

  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allOwners;
  private producerOwner;
  private consumerOwner;
  
  private resourceToCoinsObj;
  private transactionID;

    producerOwnerID = new FormControl("", Validators.required);
	  consumerOwnerID = new FormControl("", Validators.required); 

	  resourceValue = new FormControl("", Validators.required);
	  coinsValue = new FormControl("", Validators.required);
  
  constructor(private serviceTransaction:TransactionRRService, fb: FormBuilder) {
      
	  this.myForm = fb.group({
		  
		  producerOwnerID:this.producerOwnerID,
		  consumerOwnerID:this.consumerOwnerID,

      resourceValue:this.resourceValue,
      coinsValue:this.coinsValue,
    });
    
  };

  ngOnInit(): void {
    this.transactionFrom  = false;
    this.loadAllOwners()
    .then(() => {                     
            this.transactionFrom  = true;
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

  //execute transaction
  execute(form: any): Promise<any> {
          
    console.log(this.allOwners)

    //get producer and consumer owner
    for (let owner of this.allOwners) {
      console.log(owner.ownerID); 
      
      if(owner.ownerID == this.producerOwnerID.value){
        this.producerOwner = owner;
      }
      if(owner.ownerID == this.consumerOwnerID.value){
        this.consumerOwner = owner;
      }
    }

    console.log('Producer Resource ID ' + this.producerOwner.resource);
    console.log('Producer Coins ID ' + this.producerOwner.coins);
    console.log('Consumer Resource ID ' + this.consumerOwner.resource);
    console.log('Consumer Coins ID ' + this.consumerOwner.coins);
    
    //identify resource and coins id which will be debited
    var splitted_resourceID = this.producerOwner.resource.split("#", 2); 
    var resourceID = String(splitted_resourceID[1]);

    var splitted_coinsID = this.consumerOwner.coins.split("#", 2); 
    var coinsID = String(splitted_coinsID[1]);
        
    this.coinsExchanged = this.ownerCoinsPerResource * this.resourceValue.value;

    //transaction object
    this.resourceToCoinsObj = {
      $class: "org.decentralized.resource.network.ResourceToCoins",
      "resourceRate": this.ownerCoinsPerResource,
      "resourceValue": this.resourceValue.value,
      "coinsInc": this.producerOwner.coins,
      "coinsDec": this.consumerOwner.coins,
      "resourceInc": this.consumerOwner.resource,
      "resourceDec": this.producerOwner.resource,         
    };

    //chech consumer coins and producer resource assets for enough balance before creating transaction
    return this.serviceTransaction.getResource(resourceID)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      if(result.value) {
        if ((result.value - this.resourceValue.value) < 0 ){
          this.checkResultProducerResource = false;
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
              this.checkResultConsumerCoins = false;
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
              console.log(result)     
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
