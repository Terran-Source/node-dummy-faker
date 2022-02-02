# node-dummy-faker
An extension over Faker.js to create loads of fake json objects with customized properties

### Usage
First add it as dependency (devDependency for testing)
```bash
$ npm i dummy-faker --save-dev
## or
$ yarn add -D dummy-faker
```
Then start creating dummies
```js
const { dummyFaker, DataType } = require('dummy-faker');

const dummy = dummyFaker();

//* optionally set faker locale or other settings
dummy.faker.setLocale('en_IND');

dummy
  //* Step I: register an object property map
  .register('user', {
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
      .ruleFor('gender', (faker) => faker.name.gender(true))
      .ruleFor('firstName', (faker, u) => faker.name.firstName(u.gender))
      .ruleFor('lastName', (faker, u) => faker.name.lastName(u.gender))
      .ruleFor('name', (faker, u) =>
        faker.name.findName(u.firstName, u.lastName)
      )
      .ruleFor('email', (faker, u) =>
        faker.internet.email(u.firstName, u.lastName)
      )
      .ruleFor('dob', (faker) => faker.date.past(50));
  });

(async () => {
  //* Step III: Generate as many needed
  const users = await dummy.generate('user', 5); as you wish
  console.info('users:', users);
})();
```
