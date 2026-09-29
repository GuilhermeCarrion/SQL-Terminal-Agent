import { faker } from "@faker-js/faker";

export function generateUser() {
  return {
    ip: faker.internet.ip(),
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    location: faker.address.city(),
    job_area: faker.name.jobArea(),
    company: faker.company.name(),
    job_title: faker.name.jobTitle(),
  };
}

export function generateLogEntry(user) {
  return {
    ...user,
    id: faker.string.uuid(),
    timestamp: faker.date.recent().toISOString(),
  };
}
