import { Faker } from '@faker-js/faker';
import DataType from './helper/dataType';
import getDefaultFake from './helper/defaultFaker';

export type fakerCallback = (
  generator: Faker | any,
  obj?: any,
  key?: string,
  dataType?: DataType
) => any;

export default class ObjectFaker<TObj extends Record<string, DataType>> {
  generators: Record<string, fakerCallback>;
  properties: Record<string, DataType>;

  constructor(obj: TObj, generators: Record<string, fakerCallback> = {}) {
    this.properties = obj;
    // Object.keys(obj).forEach((property) => {
    //   this.properties[property] = obj[property];
    // });
    this.generators = generators;
  }

  private _defaultFaker =
    (dataType: DataType, faker: Faker): fakerCallback =>
    () =>
      getDefaultFake(dataType, faker);

  private _fakerCallbackFor = <TKey extends keyof TObj>(
    property: TKey,
    faker: Faker,
    dataType?: DataType
  ) => {
    if (this.generators.hasOwnProperty(property.toString()))
      return this.generators[property.toString()];
    let _dataType =
      dataType ?? this.properties[property.toString()] ?? DataType.default;
    return this._defaultFaker(_dataType, faker);
  };

  ruleFor<TKey extends keyof TObj>(
    property: TKey,
    cb: fakerCallback,
    dataType?: DataType
  ): this {
    let _dataType = dataType ?? DataType.default;
    if (this.properties.hasOwnProperty(property.toString())) {
      _dataType = this.properties[property.toString()];
      delete this.properties[property.toString()];
    }
    this.properties[property.toString()] = _dataType;
    this.generators[property.toString()] = cb;
    return this;
  }

  clone(): ObjectFaker<TObj> {
    return new ObjectFaker(this.properties, this.generators);
  }

  create(generator: Faker | any, faker: Faker): Obj {
    let obj: Obj = {};
    Object.keys(this.properties).forEach((prop: string) => {
      const fakerCb = this._fakerCallbackFor(prop, faker);
      obj[prop] = fakerCb(generator, obj, prop, this.properties[prop]);
    });
    return obj;
  }
}
