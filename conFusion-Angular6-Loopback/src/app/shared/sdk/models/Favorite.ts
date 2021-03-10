/* tslint:disable */
import {
  Dishes,
  Customer
} from '../index';

declare var Object: any;
export interface FavoriteInterface {
  "id"?: any;
  "dishesId"?: any;
  "customerId"?: any;
  "createdAt": Date;
  "updatedAt": Date;
  dishes?: Dishes;
  customer?: Customer;
}

export class Favorite implements FavoriteInterface {
  "id": any;
  "dishesId": any;
  "customerId": any;
  "createdAt": Date;
  "updatedAt": Date;
  dishes: Dishes;
  customer: Customer;
  constructor(data?: FavoriteInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Favorite`.
   */
  public static getModelName() {
    return "Favorite";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Favorite for dynamic purposes.
  **/
  public static factory(data: FavoriteInterface): Favorite{
    return new Favorite(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Favorite',
      plural: 'Favorites',
      path: 'Favorites',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "dishesId": {
          name: 'dishesId',
          type: 'any'
        },
        "customerId": {
          name: 'customerId',
          type: 'any'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
      },
      relations: {
        dishes: {
          name: 'dishes',
          type: 'Dishes',
          model: 'Dishes',
          relationType: 'belongsTo',
                  keyFrom: 'dishesId',
          keyTo: 'id'
        },
        customer: {
          name: 'customer',
          type: 'Customer',
          model: 'Customer',
          relationType: 'belongsTo',
                  keyFrom: 'customerId',
          keyTo: 'id'
        },
      }
    }
  }
}
