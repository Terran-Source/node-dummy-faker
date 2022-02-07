const { createNsSuch } = require('suchjs');
const { dummyFaker, DataType } = require('../index');

const Such = createNsSuch('dummy-faker.example');
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
    fixedData: DataType.string,
  })
  //* Step II: (optional) customize fine grained properties
  .customize('user', (objFaker, customData) => {
    objFaker
      .ruleFor('gender', (Such) => Such.as(':string:{5,10}'))
      .ruleFor('firstName', (Such) => Such.as(':string:{5,10}'))
      .ruleFor('lastName', (Such) => Such.as(':string:{5,10}'))
      .ruleFor('name', (_, u) => [u.firstName, u.lastName].join(' '))
      .ruleFor('someUnusable', async () => 'this property will be skipped')
      .ruleFor('email', (Such) => Such.as(':email'))
      .ruleFor('dob', (Such) => Such.as(":date:['-75 years','-5 years']"))
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
