import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CompanyService } from './Company.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Company',
	templateUrl: './Company.component.html',
	styleUrls: ['./Company.component.css'],
  	providers: [CompanyService]
})
export class CompanyComponent {

  myForm: FormGroup;

  private allCompanys;
  private company;
  private currentId;
  private errorMessage;

  private coins;
  private resource;
  
      companyID = new FormControl("", Validators.required);
      name = new FormControl("", Validators.required);
      coinsValue = new FormControl("", Validators.required);
      resourceValue = new FormControl("", Validators.required);
      resourceUnits = new FormControl("", Validators.required);
      
  constructor(private serviceCompany:CompanyService, fb: FormBuilder) {
    this.myForm = fb.group({
         
          companyID:this.companyID,
          name:this.name,      

          coinsValue:this.coinsValue,
          resourceValue:this.resourceValue,
          resourceUnits:this.resourceUnits,
          
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  

  resetForm(): void{
    this.myForm.setValue({           
          "companyID":null, 
          "name":null,                 

          "coinsValue":null,
          "resourceValue":null,
          "resourceUnits":null,
      });
  }

  //allow update name of Company
  updateCompany(form: any): Promise<any> {
    
    console.log("update check");
    this.company = {
      $class: "org.decentralized.resource.network.Company",          
            "name":this.name.value,                    

             "coins": "resource:org.decentralized.resource.network.Coins#CO_" + form.get("companyID").value,
             "resource": "resource:org.decentralized.resource.network.Resource#EN_" + form.get("companyID").value
    };
    console.log(this.company);
    return this.serviceCompany.updateCompany(form.get("companyID").value,this.company)
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

  //delete Company and the coins and resource assets associated to it
  deleteCompany(): Promise<any> {

    return this.serviceCompany.deleteCompany(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
      var coinsID = "CO_"+this.currentId;
      this.serviceCompany.deleteCoins(coinsID)
      .toPromise()
      .then(() => {
          this.serviceCompany.deleteResource("EN_"+this.currentId)
          .toPromise()
          .then(() => {
              console.log("Deleted")              
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

    return this.serviceCompany.getCompany(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {        
            "companyID":null,          
            "name":null,          

            "coinsValue":null,          
            "resourceValue":null,          
            "resourceUnits":null                               
      };

        if(result.companyID){
          formObject.companyID = result.companyID;
        }else{
          formObject.companyID = null;
        }
      
        if(result.name){
          formObject.name = result.name;
        }else{
          formObject.name = null;
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


  loadAll_OnlyCompanys(): Promise<any> {
    let tempList = [];
    return this.serviceCompany.getAllCompanys()
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

  //load all Company and the coins and resource assets associated to it 
  loadAll(): Promise<any>  {
    
    //retrieve all companys
    let companyList = [];
    return this.serviceCompany.getAllCompanys()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(company => {
        companyList.push(company);
      });     
    })
    .then(() => {

      for (let company of companyList) {
        console.log("in for loop")
        console.log(company.coins)

        var splitted_coinsID = company.coins.split("#", 2); 
        var coinsID = String(splitted_coinsID[1]);
        this.serviceCompany.getCoins(coinsID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value){
            company.coinsValue = result.value;
          }
        });

        var splitted_resourceID = company.resource.split("#", 2); 
        var resourceID = String(splitted_resourceID[1]);
        console.log(resourceID);
        this.serviceCompany.getResource(resourceID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value){
            company.resourceValue = result.value;
          }
          if(result.units){
            company.resourceUnits = result.units;
          }
        });
        
      }
      this.allCompanys = companyList;
    });

  }

  //add Company participant
  addCompany(form: any): Promise<any> {

    return this.createAssetsUtility()
      .then(() => {           
        this.errorMessage = null;
        this.myForm.setValue({
            "companyID":null,
            "name":null,
            "coinsValue":null,
            "resourceValue":null,          
            "resourceUnits":null
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

  //create coins and resource assets associated with the Owner, followed by the Owner
  createAssetsUtility(): Promise<any> {

    this.coins = {
      $class: "org.decentralized.resource.network.Coins",
          "coinsID":"CO_" + this.companyID.value,
          "value":this.coinsValue.value,
          "ownerID":this.companyID.value,
          "ownerEntity":'Company'
    };
    
    this.resource = {
      $class: "org.decentralized.resource.network.Resource",
          "resourceID":"EN_" + this.companyID.value,
          "units":this.resourceUnits.value,
          "value":this.resourceValue.value,
          "ownerID":this.companyID.value,
          "ownerEntity":'Company'        
    };
    
    this.company = {
      $class: "org.decentralized.resource.network.Company",
          "companyID":this.companyID.value,
          "name":this.name.value,

          "coins":"CO_" + this.companyID.value,
          "resource":"EN_" + this.companyID.value,
    };    

    return this.serviceCompany.addCoins(this.coins)
    .toPromise()
		.then(() => {
      console.log("create resource");
			this.serviceCompany.addResource(this.resource)      
      .toPromise()
      .then(() => {
        console.log("create companys");
        this.serviceCompany.addCompany(this.company)
        .toPromise()
        .then(() => {
          console.log("created assets");  
          location.reload();                  
        })
		  })   
		})

  }

 
}





