import faker, { Faker } from '@faker-js/faker';
import DataType from './helper/dataType';
import ObjectFaker, { fakerCallback } from './objectFaker';

/**
 * dummy-faker: An extension over Faker.js to create loads of fake json objects
 * with customized properties
 */

export type dummyFakerGenerator = {
  faker: Faker;
  register: <T extends Record<string, DataType>>(
    name: string,
    obj: T
  ) => dummyFakerGenerator;
  deregister: (name: string) => dummyFakerGenerator;
  customize: <T extends Record<string, DataType>>(
    name: string,
    callback: (objFaker: ObjectFaker<T>) => void
  ) => dummyFakerGenerator;
  generate: <T>(name: string, count?: number) => Promise<T[]>;
};

export default function dummyFaker(): dummyFakerGenerator {
  let _registrations: Obj = {};

  let _th: dummyFakerGenerator = {
    faker: faker,
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
        callback(_registrations[name]);
        return _th;
      }
      throw `${name} has not been registered. register it first`;
    },
    generate: <T extends Record<string, DataType>>(
      name: string,
      count: number = 1
    ): Promise<any[]> =>
      new Promise(async (resolve, reject) => {
        try {
          if (_registrations.hasOwnProperty(name)) {
            let result = [];
            let i = 0;
            while (i++ < count) {
              let obj: Obj = {};
              const objFaker = _registrations[name] as ObjectFaker<T>;
              const props = objFaker.properties;
              Object.keys(props).forEach((prop: string) => {
                const fakerCb = objFaker.fakerCallbackFor(prop);
                obj[prop] = fakerCb(_th.faker, obj, prop, props[prop]);
              });
              result.push(obj);
            }
            resolve(result);
          }
          reject(`${name} has not been registered. register it first`);
        } catch (error) {
          reject(error);
        }
      }),
  };

  const _init = () => {
    return _th;
  };

  return _init();
}

export { dummyFaker, DataType };
