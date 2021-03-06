import { dummyFaker, DataType } from '../index';

const dummy = dummyFaker();

//* optionally set faker locale or other settings
dummy.faker.setLocale('en_IND');

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
    fixedData: DataType.string,
  })
  //* Step II: (optional) customize fine grained properties
  .customize('user', (objFaker, customData) => {
    objFaker
      .ruleFor('gender', (faker) => faker.name.gender(true))
      .ruleFor('firstName', (faker, u) => faker.name.firstName(u.gender))
      .ruleFor('lastName', (faker, u) => faker.name.lastName(u.gender))
      .ruleFor('name', (faker, u) =>
        faker.name.findName(u.firstName, u.lastName, u.gender)
      )
      .ruleFor('someUnusable', async () => 'this property will be skipped')
      .ruleFor('email', (faker, u) =>
        faker.internet.email(u.firstName, u.lastName)
      )
      .ruleFor('dob', (faker) => faker.date.past(50))
      .ruleFor('fixedData', () => customData.fixedData);
  });

(async () => {
  //* Step III: Generate as many as needed
  const users = await dummy.generate(
    'user',
    5,
    { fixedData: 'Happy 🧐' },
    { skip: ['someUnusable'] }
  );
  console.info('users:', users);
})();
