import { Faker } from '@faker-js/faker';
import DataType from './helper/dataType';
import getDefaultFake from './helper/defaultFaker';

export type fakerCallback = (
  faker: Faker,
  obj?: any,
  key?: string,
  dataType?: DataType
) => any;

export default class ObjectFaker<TObj extends Record<string, DataType>> {
  generators: Record<string, fakerCallback> = {};
  properties: Record<string, DataType> = {};

  private _defaultFaker =
    (dataType: DataType): fakerCallback =>
    (faker) =>
      getDefaultFake(dataType, faker);

  constructor(obj: TObj) {
    this.properties = obj;
    // Object.keys(obj).forEach((property) => {
    //   this.properties[property] = obj[property];
    // });
  }

  fakerCallbackFor<TKey extends keyof TObj>(
    property: TKey,
    dataType?: DataType
  ) {
    if (this.generators.hasOwnProperty(property.toString()))
      return this.generators[property.toString()];
    let _dataType =
      dataType ?? this.properties[property.toString()] ?? DataType.default;
    return this._defaultFaker(_dataType);
  }

  ruleFor<TKey extends keyof TObj>(
    property: TKey,
    cb: fakerCallback,
    dataType?: DataType
  ) {
    let _dataType = dataType ?? DataType.default;
    if (this.properties.hasOwnProperty(property.toString())) {
      _dataType = this.properties[property.toString()];
      delete this.properties[property.toString()];
    }
    this.properties[property.toString()] = _dataType;
    this.generators[property.toString()] = cb;
    return this;
  }
}
