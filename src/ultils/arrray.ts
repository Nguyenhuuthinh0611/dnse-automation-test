import logger from "./logger";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function doesArrayContainsArray(arr: any[], target: any[]) {
	const result = target.every((v) => arr.includes(v));
	if (!result) {
		const notMatchedElements = target.filter((v) => !arr.includes(v));
		logger.info("Elements not matched:", notMatchedElements);
	}
	return result;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function containsEachOther(arr1: any[], arr2: any[]) {
	return (
		doesArrayContainsArray(arr1, arr2) && doesArrayContainsArray(arr2, arr1)
	);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function removeFromArrayWithValues(arr: any[], target: any[]) {
	return arr.filter((v) => !target.includes(v));
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function doesArrayMatchArray(arr: any[], target: any[]) {
	const result =
		arr.length === target.length && arr.every((v, i) => v === target[i]);
	if (!result) {
		const notMatchedElements = arr.filter((v, i) => v !== target[i]);
		logger.info("Elements not matched:", notMatchedElements);
	}
	return result;
}
