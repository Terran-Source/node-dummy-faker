import { Faker } from '@faker-js/faker';
import DataType from './helper/dataType';
import getDefaultFake from './helper/defaultFaker';

export type fakerCallback = (
  generator: Faker | any,
  obj?: any,
  key?: string,
  dataType?: DataType
) => Promise<any>;

export interface DummyFakerOptions {
  /// skip the given properties
  skip?: string[];
}

export default class ObjectFaker<TObj extends Record<string, DataType>> {
  generators: Record<string, fakerCallback>;
  properties: Record<string, DataType>;

  constructor(obj: TObj, generators: Record<string, fakerCallback> = {}) {
    this.properties = Object.assign({}, obj);
    // Object.keys(obj).forEach((property) => {
    //   this.properties[property] = obj[property];
    // });
    this.generators = Object.assign({}, generators);
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

  private _skipProperties = (skip?: string[]): typeof this.properties => {
    if (skip && skip.length > 0) {
      let result: typeof this.properties = {};
      Object.keys(this.properties).forEach((key) => {
        if (!skip.some((sk) => sk === key)) result[key] = this.properties[key];
      });
      return result;
    }
    return this.properties;
  };

  public ruleFor<TKey extends keyof TObj>(
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

  public clone(): ObjectFaker<TObj> {
    return new ObjectFaker(this.properties, this.generators);
  }

  public checkup(options?: DummyFakerOptions): this {
    if (options) {
      this.properties = this._skipProperties(options?.skip);
    }
    return this;
  }

  public async create(generator: Faker | any, faker: Faker): Promise<Obj> {
    let obj: Obj = {};
    const props = Object.keys(this.properties);
    for (const p in props) {
      const prop = props[p];
      obj[prop] = await this._fakerCallbackFor(prop, faker)(
        generator,
        obj,
        prop,
        this.properties[prop]
      );
    }
    return obj;
  }
}
