/* tslint:disable */
import {
  Comments,
  Favorite
} from '../index';

declare var Object: any;
export interface DishesInterface {
  "name": string;
  "image": string;
  "category": string;
  "label": string;
  "price": string;
  "featured": boolean;
  "description": string;
  "id"?: any;
  "createdAt": Date;
  "updatedAt": Date;
  comments?: Comments[];
  favorites?: Favorite[];
}

export class Dishes implements DishesInterface {
  "name": string;
  "image": string;
  "category": string;
  "label": string;
  "price": string;
  "featured": boolean;
  "description": string;
  "id": any;
  "createdAt": Date;
  "updatedAt": Date;
  comments: Comments[];
  favorites: Favorite[];
  constructor(data?: DishesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Dishes`.
   */
  public static getModelName() {
    return "Dishes";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Dishes for dynamic purposes.
  **/
  public static factory(data: DishesInterface): Dishes{
    return new Dishes(data);
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
      name: 'Dishes',
      plural: 'Dishes',
      path: 'Dishes',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "image": {
          name: 'image',
          type: 'string'
        },
        "category": {
          name: 'category',
          type: 'string'
        },
        "label": {
          name: 'label',
          type: 'string',
          default: '""'
        },
        "price": {
          name: 'price',
          type: 'string',
          default: '0'
        },
        "featured": {
          name: 'featured',
          type: 'boolean',
          default: false
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "id": {
          name: 'id',
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
        comments: {
          name: 'comments',
          type: 'Comments[]',
          model: 'Comments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'dishesId'
        },
        favorites: {
          name: 'favorites',
          type: 'Favorite[]',
          model: 'Favorite',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'dishesId'
        },
      }
    }
  }
}
