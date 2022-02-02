const DummyFaker = require('../index');

const dummyFaker = DummyFaker.default;
const DataType = DummyFaker.DataType;

const dummy = dummyFaker();

dummy.faker.setLocale('en_IND');

dummy
  .register('user', {
    firstName: DataType.uuid,
    lastName: DataType.string,
    gender: DataType.string,
    name: DataType.string,
    email: DataType.string,
    obj: DataType.json,
    dob: DataType.date,
  })
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
      .ruleFor('dob', (faker, u) => faker.date.past(50));
  });

(async () => {
  const users = await dummy.generate('user', 5);
  console.info('users:', users);
})();
