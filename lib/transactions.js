/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Resource to Coins transaction
 * @param {org.decentralized.resource.network.ResourceToCoins} UpdateValues 
 * @transaction
 */
function ResourceToCoins(UpdateValues) {

    //determine change in coins value from the rate
    var coinsChange = (UpdateValues.resourceRate * UpdateValues.resourceValue);

    //update values of the assets
    UpdateValues.coinsInc.value = UpdateValues.coinsInc.value + coinsChange;
    UpdateValues.coinsDec.value = UpdateValues.coinsDec.value - coinsChange;
    UpdateValues.resourceInc.value = UpdateValues.resourceInc.value + UpdateValues.resourceValue;
    UpdateValues.resourceDec.value = UpdateValues.resourceDec.value - UpdateValues.resourceValue;

    return getAssetRegistry('org.decentralized.resource.network.Coins')
        .then(function (assetRegistry) {
            return assetRegistry.updateAll([UpdateValues.coinsInc,UpdateValues.coinsDec]);
        })                
        .then(function () {
            return  getAssetRegistry('org.decentralized.resource.network.Resource')
            .then(function (assetRegistry) {
                return assetRegistry.updateAll([UpdateValues.resourceInc,UpdateValues.resourceDec]);
            });            
        });        
   
}


/**
 * Owner to bank transaction
 * @param {org.decentralized.resource.network.CashToCoins} UpdateValues
 * @transaction
 */
function CashToCoins(UpdateValues) {

    //determine change in coins value from the rate
    var coinsChange = (UpdateValues.cashRate * UpdateValues.cashValue);

    //update values of the assets
    UpdateValues.coinsInc.value = UpdateValues.coinsInc.value + coinsChange;
    UpdateValues.coinsDec.value = UpdateValues.coinsDec.value - coinsChange;
    UpdateValues.cashInc.value = UpdateValues.cashInc.value + UpdateValues.cashValue;
    UpdateValues.cashDec.value = UpdateValues.cashDec.value - UpdateValues.cashValue;

    return getAssetRegistry('org.decentralized.resource.network.Coins')
        .then(function (assetRegistry) {
            return assetRegistry.updateAll([UpdateValues.coinsInc,UpdateValues.coinsDec]);
        })                
        .then(function () {
            return  getAssetRegistry('org.decentralized.resource.network.Cash')
            .then(function (assetRegistry) {
                return assetRegistry.updateAll([UpdateValues.cashInc,UpdateValues.cashDec]);
            });            
        });     
}


