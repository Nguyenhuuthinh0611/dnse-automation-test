import { faker } from "@faker-js/faker";
export function randomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
export function randomNumberString(length: number) {
	return faker.string.numeric(length);
}
export function randomCode(length: number) {
	return faker.string.alphanumeric(length);
}
export function randomFullNameName() {
	return faker.person.fullName();
}

export function randomFirstName() {
	return faker.person.firstName();
}

export function randomLastName() {
	return faker.person.lastName();
}

export async function randomPhoneNumber() {
	return faker.phone.number();
}

export async function randomEmail() {
	return faker.internet.email();
}

export async function randomPassword() {
	return faker.internet.password();
}

export async function randomUuid() {
	return faker.string.uuid();
}
