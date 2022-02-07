import { dummyFaker, DataType } from '../index';
import { AbortController } from 'node-abort-controller'; // optional: for Nodejs < v15.4.0

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
  //* Step III: Generate as many as needed (until your system bleeds out)
  const abortController = new AbortController();
  const reader = await dummy.generateStream(
    'user',
    100000000, // maybe I'm getting greedy 😏
    { fixedData: 'Happy 🧐' },
    { signal: abortController.signal, skip: ['someUnusable'] }
  );
  let counter = 0;
  let threshold = 500; // that's enough 😎, you prove your point
  reader
    .on('data', (user) => {
      console.info(`user ${counter++}: `, user);
      if (counter >= threshold) abortController.abort();
    })
    .on('end', () => {
      console.info('completed streaming...');
    })
    .on('error', console.error);
})();
