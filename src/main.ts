import faker from '@faker-js/faker';

/**
 * dummy-faker: An extension over Faker.js to create loads of fake json objects
 * with customized properties
 */

export default function dummyFaker() {
  const name = faker.name.findName();

  console.info('name', name);
}
