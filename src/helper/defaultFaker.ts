import { Faker } from '@faker-js/faker';
import DataType from './dataType';

export default function getDefaultFake(dataType: DataType, faker: Faker) {
  switch (dataType) {
    case DataType.int:
    case DataType.number:
      return faker.datatype.number();
    case DataType.bigInt:
    case DataType.bigNumber:
      return faker.datatype.bigInt();
    case DataType.float:
    case DataType.double:
      return faker.datatype.float();
    case DataType.date:
    case DataType.datetime:
      return faker.datatype.datetime();
    case DataType.json:
    case DataType.object:
      return JSON.parse(faker.datatype.json());
    case DataType.bool:
    case DataType.boolean:
      return faker.datatype.boolean();
    case DataType.hex:
      return faker.datatype.hexaDecimal();
    case DataType.uuid:
    case DataType.guid:
      return faker.datatype.uuid();
    case DataType.string:
    default:
      return faker.datatype.string();
  }
}
