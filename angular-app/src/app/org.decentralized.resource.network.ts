import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.decentralized.resource.network{
   export class Owner extends Participant {
      ownerID: string;
      firstName: string;
      lastName: string;
      coins: Coins;
      cash: Cash;
      resource: Resource;
   }
   export class Bank extends Participant {
      bankID: string;
      name: string;
      coins: Coins;
      cash: Cash;
   }
   export class Company extends Participant {
      companyID: string;
      name: string;
      coins: Coins;
      resource: Resource;
   }
   export enum OwnerEntity {
      Owner,
      Bank,
      Company,
   }
   export class Coins extends Asset {
      coinsID: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class Resource extends Asset {
      resourceID: string;
      units: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class Cash extends Asset {
      cashID: string;
      currency: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class ResourceToCoins extends Transaction {
      resourceRate: number;
      resourceValue: number;
      coinsInc: Coins;
      coinsDec: Coins;
      resourceInc: Resource;
      resourceDec: Resource;
   }
   export class CashToCoins extends Transaction {
      cashRate: number;
      cashValue: number;
      coinsInc: Coins;
      coinsDec: Coins;
      cashInc: Cash;
      cashDec: Cash;
   }   
// }
