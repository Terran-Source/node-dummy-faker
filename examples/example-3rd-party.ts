import { createNsSuch } from 'suchjs';
import { dummyFaker, DataType } from '../index';

const Such = createNsSuch('dummy-faker.example');
type TSuch = typeof Such;
//* Step 0: instantiate dummyFaker with custom generator
const dummy = dummyFaker(Such);

dummy
  //* Step I: register an object property map
  .register('user', {
    id: DataType.int,
    firstName: DataType.uuid,
    lastName: DataType.string,
    gender: DataType.string,
    name: DataType.string,
    email: DataType.string,
    obj: DataType.json,
    dob: DataType.date,
  })
  //* Step II: (optional) customize fine grained properties
  .customize('user', (objFaker) => {
    objFaker
      .ruleFor('gender', (Such: TSuch) => Such.as(':string:{5,10}'))
      .ruleFor('firstName', (Such: TSuch) => Such.as(':string:{5,10}'))
      .ruleFor('lastName', (Such: TSuch) => Such.as(':string:{5,10}'))
      .ruleFor('name', (_, u) => [u.firstName, u.lastName].join(' '))
      .ruleFor('email', (Such: TSuch) => Such.as(':email'))
      .ruleFor('dob', (Such: TSuch) =>
        Such.as(":date:['-75 years','-5 years']")
      );
  });

(async () => {
  //* Step III: Generate as many as needed
  const users = await dummy.generate('user', 5);
  console.info('users:', users);
})();
