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

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BrowserFS = require('browserfs/dist/node/index');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const path = require('path');

require('chai').should();

const bfs_fs = BrowserFS.BFSRequire('fs');
const NS = 'org.decentralized.resource.network';


describe('Decentralized Resource - Admin Identity', () => {

    // let adminConnection;
    let businessNetworkConnection;

    // This is the factory for creating instances of types.
    let factory;

    // These are the identities for Alice and Bob.
    //let R1Identity;
    //let R2Identity;

    beforeEach(() => {
        BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
        const adminConnection = new AdminConnection({ fs: bfs_fs });
        return adminConnection.createProfile('defaultProfile', {
            type: 'embedded'
        })
            .then(() => {
                return adminConnection.connect('defaultProfile', 'admin', 'adminpw');
            })
            .then(() => {
                return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
            })
            .then((businessNetworkDefinition) => {
                return adminConnection.deploy(businessNetworkDefinition);
            })
            .then(() => {
                businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
                return businessNetworkConnection.connect('defaultProfile', 'decentralized-resource-network', 'admin', 'adminpw');
            })
            .then(() => {

                // Get the factory for the business network.
                factory = businessNetworkConnection.getBusinessNetwork().getFactory();


                // create 2 coins assets
                const producer_coins = factory.newResource(NS, 'Coins', 'CO_R1');
                producer_coins.value = 300;
                producer_coins.ownerID = 'R1';
                producer_coins.ownerEntity = 'Owner';

                const consumer_coins = factory.newResource(NS, 'Coins', 'CO_R2');
                consumer_coins.value = 450;
                consumer_coins.ownerID = 'R2';
                consumer_coins.ownerEntity = 'Owner';

                // create 2 resource assets
                const producer_resource = factory.newResource(NS, 'Resource', 'EN_R1');
                producer_resource.value = 35;
                producer_resource.units = 'kwH';
                producer_resource.ownerID = 'R1';
                producer_resource.ownerEntity = 'Owner';

                const consumer_resource = factory.newResource(NS, 'Resource', 'EN_R2');
                consumer_resource.value = 5;
                consumer_resource.units = 'kwH';
                consumer_resource.ownerID = 'R2';
                consumer_resource.ownerEntity = 'Owner';

                // create 2 cash assets
                const producer_cash = factory.newResource(NS, 'Cash', 'CA_R1');
                producer_cash.value = 150;
                producer_cash.currency = 'USD';
                producer_cash.ownerID = 'R1';
                producer_cash.ownerEntity = 'Owner';

                const consumer_cash = factory.newResource(NS, 'Cash', 'CA_R2');
                consumer_cash.value = 70;
                consumer_cash.currency = 'USD';
                consumer_cash.ownerID = 'R2';
                consumer_cash.ownerEntity = 'Owner';

                // create owners
                const R1 = factory.newResource(NS, 'Owner', 'R1');
                R1.firstName = 'Carlos';
                R1.lastName = 'Roca';
                R1.coins = factory.newRelationship(NS, 'Coins', producer_coins.$identifier);
                R1.cash = factory.newRelationship(NS, 'Cash', producer_resource.$identifier);
                R1.resource = factory.newRelationship(NS, 'Resource', producer_cash.$identifier);

                const R2 = factory.newResource(NS, 'Owner', 'R2');
                R2.firstName = 'James';
                R2.lastName = 'Jones';
                R2.coins = factory.newRelationship(NS, 'Coins', consumer_coins.$identifier);
                R2.cash = factory.newRelationship(NS, 'Cash', consumer_resource.$identifier);
                R2.resource = factory.newRelationship(NS, 'Resource', consumer_cash.$identifier);          
                
                //confirm the original four  value
                producer_coins.value.should.equal(300);
                consumer_coins.value.should.equal(450);
                consumer_resource.value.should.equal(5);
                producer_resource.value.should.equal(35);

                // create bank coins asset
                const bank_coins = factory.newResource(NS, 'Coins', 'CO_B1');
                bank_coins.value = 5000;
                bank_coins.ownerID = 'B1';
                bank_coins.ownerEntity = 'Bank';            

                // create bank cash asset
                const bank_cash = factory.newResource(NS, 'Cash', 'CA_B1');
                bank_cash.value = 7000;
                bank_cash.currency = 'USD';
                bank_cash.ownerID = 'B1';
                bank_cash.ownerEntity = 'Bank';
                
                // create Bank
                const B1 = factory.newResource(NS, 'Bank', 'B1');
                B1.name = 'United Bank';            
                B1.coins = factory.newRelationship(NS, 'Coins', bank_coins.$identifier);
                B1.cash = factory.newRelationship(NS, 'Cash', bank_cash.$identifier);

                //confirm the original values                
                bank_coins.value.should.equal(5000);
                bank_cash.value.should.equal(7000);

                // create company coins asset
                const utility_coins = factory.newResource(NS, 'Coins', 'CO_U1');
                utility_coins.value = 5000;
                utility_coins.ownerID = 'U1';
                utility_coins.ownerEntity = 'Company';            

                // create utility resource asset
                const utility_resource = factory.newResource(NS, 'Resource', 'EN_U1');
                utility_resource.value = 1000;
                utility_resource.units = 'kwh';
                utility_resource.ownerID = 'U1';
                utility_resource.ownerEntity = 'Company';
                
                // create Utility Company
                const U1 = factory.newResource(NS, 'Company', 'U1');
                U1.name = 'New Utility';            
                U1.coins = factory.newRelationship(NS, 'Coins', utility_coins.$identifier);
                U1.resource = factory.newRelationship(NS, 'Resource', utility_resource.$identifier);

                //confirm the original values                
                utility_coins.value.should.equal(5000);
                utility_resource.value.should.equal(1000);
                
                // Get the coins registry
                return businessNetworkConnection.getAssetRegistry(NS + '.Coins')
                    .then((assetRegistry) => {
                        // add coins to the coins asset registry.
                        return assetRegistry.addAll([producer_coins, consumer_coins, bank_coins, utility_coins])
                        
                        .then(() => {
                            // Get the resource registry
                            return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                        })
                        .then((assetRegistry) => {
                            // add resource to the resource asset registry.
                            return assetRegistry.addAll([producer_resource, consumer_resource, utility_resource]);
                        })
                        .then(() => {
                            // Get the cash registry
                            return businessNetworkConnection.getAssetRegistry(NS + '.Cash');
                        })
                        .then((assetRegistry) => {
                            // add cash to the cash asset registry.
                            return assetRegistry.addAll([producer_cash, consumer_cash, bank_cash]);
                        })                       
                        .then(() => {
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Owner');
                        })
                        .then((participantRegistry) => {
                            // add owner
                            return participantRegistry.addAll([R1, R2]);
                        })
                        .then(() => {
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Bank');
                        })
                        .then((participantRegistry) => {
                            // add bank
                            return participantRegistry.add(B1);
                        })
                        .then(() => {
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Company');
                        })
                        .then((participantRegistry) => {
                            // add company
                            return participantRegistry.add(U1);
                        });                        
                    });

            });
    });

            
    describe('#OwnerToOwner Transaction', () => {

        it('Owner should be able to exchange resource for coins through a transaction with fellow Owner', () => {
            
                                    
            // create the owner to owner transaction
            const owner_to_owner = factory.newTransaction(NS, 'ResourceToCoins');
            owner_to_owner.resourceRate = 1;
            owner_to_owner.resourceValue = 10;
            owner_to_owner.coinsInc = factory.newRelationship(NS, 'Coins', 'CO_R1');
            owner_to_owner.coinsDec = factory.newRelationship(NS, 'Coins', 'CO_R2');
            owner_to_owner.resourceInc = factory.newRelationship(NS, 'Resource', 'EN_R2');
            owner_to_owner.resourceDec = factory.newRelationship(NS, 'Resource', 'EN_R1');           
               
            return businessNetworkConnection.submitTransaction(owner_to_owner)                        
                    .then(() => {
                        return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the producer_coins
                        return assetRegistry.get('CO_R1');
                    })
                    .then((updated_producer_coins) => {
                        // the updated values of coins
                        updated_producer_coins.value.should.equal(310);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_coins
                        return assetRegistry.get('CO_R2');
                    })
                    .then((updated_consumer_coins) => {
                        // the updated values of coins
                        updated_consumer_coins.value.should.equal(440);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_resource
                        return assetRegistry.get('EN_R2');
                    })
                    .then((updated_consumer_resource) => {
                        // the updated values of resource
                        updated_consumer_resource.value.should.equal(15);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                    })
                    .then((assetRegistry) => {
                        // re-get the producer_resource
                        return assetRegistry.get('EN_R1');
                    })
                    .then((updated_producer_resource) => {
                        // the updated values of resource
                        updated_producer_resource.value.should.equal(25);
                    });
        });       
    });
        
    describe('#OwnerToBank Transaction', () => {

        it('Owner should be able to exchange coins for cash through a transaction with Bank', () => {
                                                
            // create the owner to bank transaction
            const owner_to_bank = factory.newTransaction(NS, 'CashToCoins');
            owner_to_bank.cashRate = 10;
            owner_to_bank.cashValue = 20;
            owner_to_bank.coinsInc = factory.newRelationship(NS, 'Coins', 'CO_B1');
            owner_to_bank.coinsDec = factory.newRelationship(NS, 'Coins', 'CO_R1');
            owner_to_bank.cashInc = factory.newRelationship(NS, 'Cash', 'CA_R1');
            owner_to_bank.cashDec = factory.newRelationship(NS, 'Cash', 'CA_B1');
                           
             // submit the transaction        
            return businessNetworkConnection.submitTransaction(owner_to_bank)
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the producer_coins
                    return assetRegistry.get('CO_R1');
                })
                .then((updated_owner_coins) => {
                    // the updated values of coins
                    updated_owner_coins.value.should.equal(100);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_coins
                    return assetRegistry.get('CO_B1');
                })
                .then((updated_bank_coins) => {
                    // the updated values of coins
                    updated_bank_coins.value.should.equal(5200);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Cash');
                })
                .then((assetRegistry) => {
                    // re-get the owner_cash
                    return assetRegistry.get('CA_R1');
                })
                .then((updated_owner_cash) => {
                    // the updated values of resource
                    updated_owner_cash.value.should.equal(170);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Cash');
                })
                .then((assetRegistry) => {
                    // re-get the owner_cash
                    return assetRegistry.get('CA_B1');
                })
                .then((updated_bank_cash) => {
                    // the updated values ofresourceresource
                    updated_bank_cash.value.should.equal(6980);
                });
        });       
    }); 

    describe('#OwnerToCompany Transaction', () => {

        it('Owner should be able to exchange coins for resource through a transaction with Utility', () => {        
            
            // create the owner to company transaction
            const owner_to_utility = factory.newTransaction(NS, 'ResourceToCoins');
            owner_to_utility.resourceRate = 1;
            owner_to_utility.resourceValue = 10;
            owner_to_utility.coinsInc = factory.newRelationship(NS, 'Coins', 'CO_U1');
            owner_to_utility.coinsDec = factory.newRelationship(NS, 'Coins', 'CO_R2');
            owner_to_utility.resourceInc = factory.newRelationship(NS, 'Resource', 'EN_R2');
            owner_to_utility.resourceDec = factory.newRelationship(NS, 'Resource', 'EN_U1');
               
            return businessNetworkConnection.submitTransaction(owner_to_utility)                        
                    .then(() => {
                        return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the utility_coins
                        return assetRegistry.get('CO_U1');
                    })
                    .then((updated_utility_coins) => {
                        // the updated values of coins
                        updated_utility_coins.value.should.equal(5010);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_coins
                        return assetRegistry.get('CO_R2');
                    })
                    .then((updated_consumer_coins) => {
                        // the updated values of coins
                        updated_consumer_coins.value.should.equal(440);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_resource
                        return assetRegistry.get('EN_R2');
                    })
                    .then((updated_consumer_resource) => {
                        // the updated values of resource
                        updated_consumer_resource.value.should.equal(15);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                    })
                    .then((assetRegistry) => {
                        // re-get the utility_resource
                        return assetRegistry.get('EN_U1');
                    })
                    .then((updated_utility_resource) => {
                        // the updated values of resource
                        updated_utility_resource.value.should.equal(990);
                    });
        }); 
    }); 


});



describe('Owner Identity', () => {

    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    // This is the factory for creating instances of types.
    let factory;

    // These are the identities for Alice and Bob.
    //let R1Identity;
    let R2Identity;
    let B1Identity;
    let U1Identity;

    // This is called before each test is executed.
    beforeEach(() => {

        // Initialize an in-memory file system, so we do not write any files to the actual file system.
        BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());

        // Create a new admin connection.
        const adminConnection = new AdminConnection({
            fs: bfs_fs
        });

        // Create a new connection profile that uses the embedded (in-memory) runtime.
        return adminConnection.createProfile('defaultProfile', {
            type: 'embedded'
        })
            .then(() => {

                // Establish an admin connection. The user ID must be admin. The user secret is
                // ignored, but only when the tests are executed using the embedded (in-memory)
                // runtime.
                return adminConnection.connect('defaultProfile', 'admin', 'adminpw');

            })
            .then(() => {

                // Generate a business network definition from the project directory.
                return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));

            })
            .then((businessNetworkDefinition) => {

                // Deploy and start the business network defined by the business network definition.
                return adminConnection.deploy(businessNetworkDefinition);

            })
            .then(() => {

                // Create and establish a business network connection
                businessNetworkConnection = new BusinessNetworkConnection({
                    fs: bfs_fs
                });                
                return businessNetworkConnection.connect('defaultProfile', 'decentralized-resource-network', 'admin', 'adminpw');

            })
            .then(() => {

                // Get the factory for the business network.
                factory = businessNetworkConnection.getBusinessNetwork().getFactory();


                // create 2 coins assets
                const producer_coins = factory.newResource(NS, 'Coins', 'CO_R1');
                producer_coins.value = 300;
                producer_coins.ownerID = 'R1';
                producer_coins.ownerEntity = 'Owner';

                const consumer_coins = factory.newResource(NS, 'Coins', 'CO_R2');
                consumer_coins.value = 450;
                consumer_coins.ownerID = 'R2';
                consumer_coins.ownerEntity = 'Owner';

                // create 2 resource assets
                const producer_resource = factory.newResource(NS, 'Resource', 'EN_R1');
                producer_resource.value = 35;
                producer_resource.units = 'kwH';
                producer_resource.ownerID = 'R1';
                producer_resource.ownerEntity = 'Owner';

                const consumer_resource = factory.newResource(NS, 'Resource', 'EN_R2');
                consumer_resource.value = 5;
                consumer_resource.units = 'kwH';
                consumer_resource.ownerID = 'R2';
                consumer_resource.ownerEntity = 'Owner';

                // create 2 cash assets
                const producer_cash = factory.newResource(NS, 'Cash', 'CA_R1');
                producer_cash.value = 150;
                producer_cash.currency = 'USD';
                producer_cash.ownerID = 'R1';
                producer_cash.ownerEntity = 'Owner';

                const consumer_cash = factory.newResource(NS, 'Cash', 'CA_R2');
                consumer_cash.value = 70;
                consumer_cash.currency = 'USD';
                consumer_cash.ownerID = 'R2';
                consumer_cash.ownerEntity = 'Owner';

                // create owners
                const R1 = factory.newResource(NS, 'Owner', 'R1');
                R1.firstName = 'Carlos';
                R1.lastName = 'Roca';
                R1.coins = factory.newRelationship(NS, 'Coins', producer_coins.$identifier);
                R1.cash = factory.newRelationship(NS, 'Cash', producer_resource.$identifier);
                R1.resource = factory.newRelationship(NS, 'Resource', producer_cash.$identifier);

                const R2 = factory.newResource(NS, 'Owner', 'R2');
                R2.firstName = 'James';
                R2.lastName = 'Jones';
                R2.coins = factory.newRelationship(NS, 'Coins', consumer_coins.$identifier);
                R2.cash = factory.newRelationship(NS, 'Cash', consumer_resource.$identifier);
                R2.resource = factory.newRelationship(NS, 'Resource', consumer_cash.$identifier);  
                
                // create bank coins asset
                const bank_coins = factory.newResource(NS, 'Coins', 'CO_B1');
                bank_coins.value = 5000;
                bank_coins.ownerID = 'B1';
                bank_coins.ownerEntity = 'Bank';            

                // create bank cash asset
                const bank_cash = factory.newResource(NS, 'Cash', 'CA_B1');
                bank_cash.value = 7000;
                bank_cash.currency = 'USD';
                bank_cash.ownerID = 'B1';
                bank_cash.ownerEntity = 'Bank';
                
                // create Bank
                const B1 = factory.newResource(NS, 'Bank', 'B1');
                B1.name = 'United Bank';            
                B1.coins = factory.newRelationship(NS, 'Coins', bank_coins.$identifier);
                B1.cash = factory.newRelationship(NS, 'Cash', bank_cash.$identifier);

                //confirm the original values                
                bank_coins.value.should.equal(5000);
                bank_cash.value.should.equal(7000);

                // create company coins asset
                const utility_coins = factory.newResource(NS, 'Coins', 'CO_U1');
                utility_coins.value = 5000;
                utility_coins.ownerID = 'U1';
                utility_coins.ownerEntity = 'Company';            

                // create utility resource asset
                const utility_resource = factory.newResource(NS, 'Resource', 'EN_U1');
                utility_resource.value = 1000;
                utility_resource.units = 'kwh';
                utility_resource.ownerID = 'U1';
                utility_resource.ownerEntity = 'Company';
                
                // create Utility Company
                const U1 = factory.newResource(NS, 'Company', 'U1');
                U1.name = 'New Utility';            
                U1.coins = factory.newRelationship(NS, 'Coins', utility_coins.$identifier);
                U1.resource = factory.newRelationship(NS, 'Resource', utility_resource.$identifier);

                //confirm the original values                
                utility_coins.value.should.equal(5000);
                utility_resource.value.should.equal(1000);
                
                // Get the coins registry
                return businessNetworkConnection.getAssetRegistry(NS + '.Coins')
                    .then((assetRegistry) => {
                        // add coins to the coins asset registry.
                        return assetRegistry.addAll([producer_coins, consumer_coins, bank_coins, utility_coins])
                        
                        .then(() => {
                            // Get the resource registry
                            return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                        })
                        .then((assetRegistry) => {
                            // add resource to the resource asset registry.
                            return assetRegistry.addAll([producer_resource, consumer_resource, utility_resource]);
                        })
                        .then(() => {
                            // Get the cash registry
                            return businessNetworkConnection.getAssetRegistry(NS + '.Cash');
                        })
                        .then((assetRegistry) => {
                            // add cash to the cash asset registry.
                            return assetRegistry.addAll([producer_cash, consumer_cash, bank_cash]);
                        })                       
                        .then(() => {
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Owner');
                        })
                        .then((participantRegistry) => {
                            // add owner
                            return participantRegistry.addAll([R1, R2]);
                        })
                        .then(() => {
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Bank');
                        })
                        .then((participantRegistry) => {
                            // add bank
                            return participantRegistry.add(B1);
                        })
                        .then(() => {
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Company');
                        })
                        .then((participantRegistry) => {
                            // add company
                            return participantRegistry.add(U1);
                        });
                        
                    });

            })
            .then(() => {

                // Issue the identities.
                return businessNetworkConnection.issueIdentity('org.decentralized.resource.network.Owner#R1', 'owner1')
                    .then((identity) => {
                        //R1Identity = identity;
                        return businessNetworkConnection.issueIdentity('org.decentralized.resource.network.Owner#R2', 'owner2');
                    })
                    .then((identity) => {
                        R2Identity = identity;
                        return businessNetworkConnection.issueIdentity('org.decentralized.resource.network.Bank#B1', 'bank1');
                    })
                    .then((identity) => {
                        B1Identity = identity;
                        return businessNetworkConnection.issueIdentity('org.decentralized.resource.network.Company#U1', 'utility1');
                    })
                    .then((identity) => {
                        U1Identity = identity;
                    });
            });

    });

    /**
     * Reconnect using a different identity.
     * @param {Object} identity The identity to use.
     * @return {Promise} A promise that will be resolved when complete.
     */
    function useIdentity(identity) {
        return businessNetworkConnection.disconnect()
            .then(() => {
                businessNetworkConnection = new BusinessNetworkConnection({
                    fs: bfs_fs
                });                
                return businessNetworkConnection.connect('defaultProfile', 'decentralized-resource-network', identity.userID, identity.userSecret);
            });
    }

    describe('#Owners Access', () => {

        it('Owners should have read access to all coins, resource and cash assets, read access to other Owners, Banks and Utility Companies, and update only their own Owner record' , () => {
            
            return useIdentity(R2Identity)
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectOwners');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(2); 
                    //results[0].getIdentifier().should.equal('R2');                           
                })                
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectBanks');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectUtilityCompanies');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCoins');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(4);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCash');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectResource');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                });
                
        });
    });
/*
    describe('#OwnerToOwner Transaction', () => {

        it('Owners should be able to execute transactions with Owners' , () => {
            
            // create the owner to owner transaction
            const owner_to_owner = factory.newTransaction(NS, 'ResourceToCoins');
            owner_to_owner.resourceRate = 4;
            owner_to_owner.resourceValue = 10;
            owner_to_owner.coinsInc = factory.newRelationship(NS, 'Coins', 'CO_R1');
            owner_to_owner.coinsDec = factory.newRelationship(NS, 'Coins', 'CO_R2');
            owner_to_owner.resourceInc = factory.newRelationship(NS, 'Resource', 'EN_R2');
            owner_to_owner.resourceDec = factory.newRelationship(NS, 'Resource', 'EN_R1');

            return useIdentity(R2Identity)
                    .then(() => {                                        
                        return businessNetworkConnection.submitTransaction(owner_to_owner);
                    })
                    .then(() => {
                        return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the producer_coins
                        return assetRegistry.get('CO_R1');
                    })
                    .then((updated_producer_coins) => {
                        // the updated values of coins
                        updated_producer_coins.value.should.equal(340);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_coins
                        return assetRegistry.get('CO_R2');
                    })
                    .then((updated_consumer_coins) => {
                        // the updated values of coins
                        updated_consumer_coins.value.should.equal(410);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_resource
                        return assetRegistry.get('EN_R2');
                    })
                    .then((updated_consumer_resource) => {
                        // the updated values of resource
                        updated_consumer_resource.value.should.equal(15);
                        return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                    })
                    .then((assetRegistry) => {
                        // re-get the producer_resource
                        return assetRegistry.get('EN_R1');
                    })
                    .then((updated_producer_resource) => {
                        // the updated values of resource
                        updated_producer_resource.value.should.equal(25);
                    });
                
        }); 
    });

    describe('#OwnerToBank Transaction', () => {

        it('Owners should be able to execute transactions with Banks' , () => {
            
            // create the owner to owner transaction
            const owner_to_bank = factory.newTransaction(NS, 'CashToCoins');
            owner_to_bank.cashRate = 2;
            owner_to_bank.cashValue = 20;
            owner_to_bank.coinsInc = factory.newRelationship(NS, 'Coins', 'CO_B1');
            owner_to_bank.coinsDec = factory.newRelationship(NS, 'Coins', 'CO_R1');
            owner_to_bank.cashInc = factory.newRelationship(NS, 'Cash', 'CA_R1');
            owner_to_bank.cashDec = factory.newRelationship(NS, 'Cash', 'CA_B1');
                           
             // submit the transaction        
            return useIdentity(R1Identity)
                .then(() => {  
                    return businessNetworkConnection.submitTransaction(owner_to_bank);
                })
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the producer_coins
                    return assetRegistry.get('CO_R1');
                })
                .then((updated_owner_coins) => {
                    // the updated values of coins
                    updated_owner_coins.value.should.equal(260);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_coins
                    return assetRegistry.get('CO_B1');
                })
                .then((updated_bank_coins) => {
                    // the updated values of coins
                    updated_bank_coins.value.should.equal(5040);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Cash');
                })
                .then((assetRegistry) => {
                    // re-get the owner_cash
                    return assetRegistry.get('CA_R1');
                })
                .then((updated_owner_cash) => {
                    // the updated values of resource
                    updated_owner_cash.value.should.equal(270);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Cash');
                })
                .then((assetRegistry) => {
                    // re-get the owner_cash
                    return assetRegistry.get('CA_B1');
                })
                .then((updated_bank_cash) => {
                    // the updated values ofresourceresource
                    updated_bank_cash.value.should.equal(6880);
                });                
        }); 
    });


    describe('#OwnerToCompany Transaction', () => {

        it('Owners should be able to execute transactions with UtilityCompanies' , () => {
            
            
            // create the owner to company transaction
            const owner_to_utility = factory.newTransaction(NS, 'ResourceToCoins');
            owner_to_utility.resourceRate = 4;
            owner_to_utility.resourceValue = 10;
            owner_to_utility.coinsInc = factory.newRelationship(NS, 'Coins', 'CO_U1');
            owner_to_utility.coinsDec = factory.newRelationship(NS, 'Coins', 'CO_R2');
            owner_to_utility.resourceInc = factory.newRelationship(NS, 'Resource', 'EN_R2');
            owner_to_utility.resourceDec = factory.newRelationship(NS, 'Resource', 'EN_U1');
               
            return useIdentity(R2Identity)
                .then(() => {
                    return businessNetworkConnection.submitTransaction(owner_to_utility);
                })
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the utility_coins
                    return assetRegistry.get('CO_U1');
                })
                .then((updated_utility_coins) => {
                    // the updated values of coins
                    updated_utility_coins.value.should.equal(5040);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_coins
                    return assetRegistry.get('CO_R2');
                })
                .then((updated_consumer_coins) => {
                    // the updated values of coins
                    updated_consumer_coins.value.should.equal(410);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_resource
                    return assetRegistry.get('EN_R2');
                })
                .then((updated_consumer_resource) => {
                    // the updated values of resource
                    updated_consumer_resource.value.should.equal(15);
                    return businessNetworkConnection.getAssetRegistry(NS + '.Resource');
                })
                .then((assetRegistry) => {
                    // re-get the utility_resource
                    return assetRegistry.get('EN_U1');
                })
                .then((updated_utility_resource) => {
                    // the updated values of resource
                    updated_utility_resource.value.should.equal(990);
                    
                });                
        }); 
    });
*/
    describe('#Banks Access', () => {

        it('Banks should have read only access to all coins and cash assets, read access to other Banks and Owners, and update access to their own Bank record' , () => {
            
            return useIdentity(B1Identity)
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectOwners');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(2); 
                    //results[0].getIdentifier().should.equal('R2');                           
                })                
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectBanks');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectUtilityCompanies');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCoins');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(4);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCash');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectResource');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                });
                
        });
    });


    describe('#Utility Company Access', () => {

        it('Utility Company should have read only access to all coins, and resource assets, read access to other Utilty Companies and Owners, and update access to their own Bank record' , () => {
            
            return useIdentity(U1Identity)
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectOwners');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(2); 
                    //results[0].getIdentifier().should.equal('R2');                           
                })                
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectBanks');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectUtilityCompanies');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCoins');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(4);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCash');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectResource');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                });
                
        });
    });
    
});


