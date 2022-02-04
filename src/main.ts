import faker, { Faker } from '@faker-js/faker';
import DataType from './helper/dataType';
import ObjectFaker, { fakerCallback } from './objectFaker';

/**
 * dummy-faker: An extension over Faker.js to create loads of fake json objects
 * with customized properties
 */

export type dummyFakerGenerator = {
  faker: Faker;
  generator?: any;
  register: <T extends Record<string, DataType>>(
    name: string,
    obj: T
  ) => dummyFakerGenerator;
  deregister: (name: string) => dummyFakerGenerator;
  customize: <T extends Record<string, DataType>>(
    name: string,
    callback: (objFaker: ObjectFaker<T>, customData?: any) => void
  ) => dummyFakerGenerator;
  generate: <T extends Record<string, DataType>>(
    name: string,
    count?: number,
    customData?: any
  ) => Promise<any[]>;
  create: <T extends Record<string, DataType>>(
    name: string,
    customData?: any
  ) => Promise<any>;
};

export default function dummyFaker(generator?: any): dummyFakerGenerator {
  let _registrations: Obj = {};
  let _customizations: Obj = {};

  let _th: dummyFakerGenerator = {
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
    generate: <T extends Record<string, DataType>>(
      name: string,
      count: number = 1,
      customData?: any
    ): Promise<any[]> =>
      new Promise(async (resolve, reject) => {
        try {
          if (_registrations.hasOwnProperty(name)) {
            const objFaker = (_registrations[name] as ObjectFaker<T>).clone();
            if (_customizations.hasOwnProperty(name)) {
              _customizations[name](objFaker, customData);
            }
            resolve(
              Array.from({ length: count }).map<Obj>(() =>
                objFaker.create(_th.generator ?? _th.faker, _th.faker)
              )
            );
          }
          reject(`${name} has not been registered. register it first`);
        } catch (error) {
          reject(error);
        }
      }),
    create: async <T extends Record<string, DataType>>(
      name: string,
      customData?: any
    ): Promise<any> => (await _th.generate<T>(name, 1, customData))[0],
  };

  const _init = () => {
    return _th;
  };

  return _init();
}

export { dummyFaker, DataType };
