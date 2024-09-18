import { expect } from "@playwright/test";
import { type IOrder, checkSorted } from "../ultils/sort";
// Asserts for single value

/**
 * Asserts that the actual value is equal to the expected value.
 * Throws an error with a custom message if the values are not equal.
 *
 * @param actual - The actual value to compare.
 * @param expected - The expected value to compare against.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertEquals(actual: any, expected: any) {
	expect(actual, {
		message: `Actual: ${actual} is not equal to expected: ${expected}`,
	}).toEqual(expected);
}

/**
 * Asserts that the actual value is not equal to the expected value.
 *
 * @param actual - The actual value to be compared.
 * @param expected - The expected value to be compared against.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertNotEquals(actual: any, expected: any) {
	expect(actual).not.toEqual(expected);
}

/**
 * Asserts that the actual value is greater than the expected value.
 *
 * @param actual - The actual value to be compared.
 * @param expected - The expected value to compare against.
 */
export function assertGreater(actual: number, expected: number) {
	expect(actual).toBeGreaterThan(expected);
}

/**
 * Asserts that the actual value is greater than or equal to the expected value.
 *
 * @param actual - The actual value to be compared.
 * @param expected - The expected value to compare against.
 */
export function assertGreaterOrEqual(actual: number, expected: number) {
	expect(actual).toBeGreaterThanOrEqual(expected);
}

/**
 * Asserts that the actual value is less than the expected value.
 *
 * @param actual - The actual value to compare.
 * @param expected - The expected value to compare against.
 */
export function assertLess(actual: number, expected: number) {
	expect(actual).toBeLessThan(expected);
}

/**
 * Asserts that the actual value is less than or equal to the expected value.
 *
 * @param actual - The actual value to be compared.
 * @param expected - The expected value to compare against.
 */
export function assertLessOrEqual(actual: number, expected: number) {
	expect(actual).toBeLessThanOrEqual(expected);
}

/**
 * Asserts that the given value is true.
 * @param actual - The value to be checked.
 */
export function assertTrue(actual: boolean) {
	expect(actual).toBeTruthy();
}

/**
 * Asserts that the given value is false.
 *
 * @param actual - The value to be checked.
 */
export function assertFalse(actual: boolean) {
	expect(actual).toBeFalsy();
}

/**
 * Asserts that the given value is null.
 *
 * @param actual - The value to be checked.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertNull(actual: any) {
	expect(actual).toBeNull();
}

/**
 * Asserts that the given value is not null.
 * Throws an error if the value is null.
 *
 * @param actual - The value to be checked.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertNotNull(actual: any) {
	expect(actual).not.toBeNull();
}

/**
 * Asserts that the given value is undefined.
 *
 * @param actual - The value to be checked.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertUndefined(actual: any) {
	expect(actual).toBeUndefined();
}

/**
 * Asserts that the given value is not undefined.
 * @param actual - The value to be checked.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertNotUndefined(actual: any) {
	expect(actual).not.toBeUndefined();
}

/**
 * Asserts that the given actual string is equal to the expected string.
 *
 * @param {string} actual - The actual string to compare.
 * @param {string} expected - The expected string to compare against.
 * @return {Promise<void>} - A promise that resolves when the assertion is successful.
 * @throws {Error} - If the actual string is not equal to the expected string.
 */
export function assertStringContains(actual: string, expected: string) {
	expect(actual).toContain(expected);
}

/**
 * Asserts that a string does not contain the expected substring.
 *
 * @param actual - The actual string to check.
 * @param expected - The expected substring that should not be present in the actual string.
 */
export function assertStringNotContains(actual: string, expected: string) {
	expect(actual).not.toContain(expected);
}

// Asserts for array
/**
 * Asserts that two arrays match each other.
 *
 * @param actual - The actual array.
 * @param expected - The expected array.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertArrayMatches(actual: Array<any>, expected: Array<any>) {
	assertArrayContains(actual, expected);
	assertArrayContains(expected, actual);
}

/**
 * Asserts that the actual array contains all the elements from the expected array.
 *
 * @param actual - The actual array to be checked.
 * @param expected - The expected array containing the elements to be checked against.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertArrayContains(actual: Array<any>, expected: Array<any>) {
	const isTrue = actual.every((value) => expected.includes(value));
	expect(isTrue, {
		message: `Actual array ${actual} does not contain expected array ${expected}`,
	}).toBeTruthy();
}

/**
 * Asserts that an array is sorted according to the specified options.
 *
 * @param arr - The array to be checked.
 * @param options - The options specifying the sorting order.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertSorted(arr: any[], options: IOrder) {
	expect(() => checkSorted(arr, options)).not.toThrowError();
}

/**
 * Asserts that the given array is sorted in ascending order.
 *
 * @param {any[]} arr - The array to be checked for ascending order.
 * @return {Promise<void>} - A promise that resolves when the assertion is successful.
 * @throws {Error} - If the array is not sorted in ascending order.
 * @deprecated - Use assertSorted instead.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertAscendingOrder(arr: any[]) {
	expect(arr).toEqual(expect.arrayContaining(arr.sort()));
}

/**
 * Asserts that the given array is sorted in descending order.
 *
 * @param {any[]} arr - The array to be checked for descending order.
 * @return {Promise<void>} - A promise that resolves when the assertion is successful.
 * @throws {Error} - If the array is not sorted in descending order.
 * @deprecated - Use assertSorted instead.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertDescendingOrder(arr: any[]) {
	expect(arr).toEqual(expect.arrayContaining(arr.sort().reverse()));
}
