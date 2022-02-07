import faker, { Faker } from '@faker-js/faker';
import { Readable, ReadableOptions } from 'stream';
import DataType from './helper/dataType';
import ObjectFaker, { DummyFakerOptions } from './objectFaker';

/**
 * dummy-faker: An extension over Faker.js to create loads of fake json objects
 * with customized properties
 */

export type DummyFakerGenerator = {
  faker: Faker;
  generator?: any;
  register: <T extends Record<string, DataType>>(
    name: string,
    obj: T
  ) => DummyFakerGenerator;
  deregister: (name: string) => DummyFakerGenerator;
  customize: <T extends Record<string, DataType>>(
    name: string,
    callback: (objFaker: ObjectFaker<T>, customData?: any) => void
  ) => DummyFakerGenerator;
  create: <T extends Record<string, DataType>>(
    name: string,
    customData?: any
  ) => Promise<any>;
  generate: <T extends Record<string, DataType>>(
    name: string,
    count?: number,
    customData?: any,
    options?: DummyGenerateOptions
  ) => Promise<any[]>;
  generateStream: <T extends Record<string, DataType>>(
    name: string,
    count?: number,
    customData?: any,
    options?: DummyStreamOptions
  ) => Readable;
};

export interface DummyGenerateOptions extends DummyFakerOptions {}

export interface DummyStreamOptions
  extends DummyGenerateOptions,
    ReadableOptions {
  signal?: AbortSignal;
}

export default function dummyFaker(generator?: any): DummyFakerGenerator {
  let _registrations: Obj = {};
  let _customizations: Obj = {};

  const _streamGenerator = async function* <T extends Record<string, DataType>>(
    objFaker: ObjectFaker<T>,
    generator: Faker | any,
    faker: Faker,
    count: number,
    signal?: AbortSignal
  ): AsyncGenerator<any> {
    let i = 0;
    while (i++ < count && !signal?.aborted === true) {
      yield await objFaker.create(generator, faker);
    }
  };

  const _getObjFaker = <T extends Record<string, DataType>>(
    _th: DummyFakerGenerator,
    name: string,
    customData?: any,
    options?: DummyGenerateOptions
  ): ObjectFaker<T> => {
    if (_registrations.hasOwnProperty(name)) {
      const objFaker = (_registrations[name] as ObjectFaker<T>).clone();
      if (_customizations.hasOwnProperty(name)) {
        _customizations[name](objFaker, customData);
      }
      objFaker.checkup(options);
      return objFaker;
    }
    throw `${name} has not been registered. register it first`;
  };

  const _th: DummyFakerGenerator = {
    faker: faker,
    generator: generator,
    register: <T extends Record<string, DataType>>(name: string, obj: T) => {
      if (_registrations.hasOwnProperty(name))
        throw (
          'Same object has already been registered. ' +
          'Either register it with a new name or use deregister first'
        );
      else _registrations[name] = new ObjectFaker(obj);
      return _th;
    },
    deregister: (name: string) => {
      if (_registrations.hasOwnProperty(name)) {
        delete _registrations[name];
      }
      return _th;
    },
    customize: <T extends Record<string, DataType>>(
      name: string,
      callback: (objFaker: ObjectFaker<T>, customData?: any) => void
    ) => {
      if (_registrations.hasOwnProperty(name)) {
        _customizations[name] = callback;
        return _th;
      }
      throw `${name} has not been registered. register it first`;
    },
    create: async <T extends Record<string, DataType>>(
      name: string,
      customData?: any
    ): Promise<any> => (await _th.generate<T>(name, 1, customData))[0],
    generate: <T extends Record<string, DataType>>(
      name: string,
      count: number = 1,
      customData?: any,
      options?: DummyGenerateOptions
    ): Promise<any[]> =>
      new Promise(async (resolve, reject) => {
        try {
          const objFaker = _getObjFaker(_th, name, customData, options);
          resolve(
            Promise.all(
              Array.from({ length: count }).map<Promise<Obj>>(() =>
                objFaker.create(_th.generator ?? _th.faker, _th.faker)
              )
            )
          );
        } catch (error) {
          reject(error);
        }
      }),
    generateStream: <T extends Record<string, DataType>>(
      name: string,
      count: number = 1,
      customData?: any,
      options?: DummyStreamOptions
    ): Readable => {
      const objFaker = _getObjFaker(_th, name, customData, options);
      return Readable.from(
        _streamGenerator(
          objFaker,
          _th.generator ?? _th.faker,
          _th.faker,
          count,
          options?.signal
        ),
        options
      );
    },
  };

  const _init = () => {
    return _th;
  };

  return _init();
}

export { dummyFaker, DataType };
