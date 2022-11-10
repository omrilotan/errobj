import { verify } from "./index";

describe("verify", (): void => {
	test.each([
		undefined,
		null,
		() => null,
		"string",
		100,
		[],
		{},
		/\w/g,
		new Set(),
	])("Should throw error for %s", (value: any): void =>
		expect(() => verify(value)).toThrow(RangeError)
	);
	test.each([
		new Error(),
		new RangeError(),
		new ReferenceError(),
		new SyntaxError(),
		new TypeError(),
		(() => {
			class SomeCustomError extends Error {
				constructor(...args) {
					super(...args);
				}
			}

			return new SomeCustomError();
		})(),
	])("Should accept %s", (value: Error): void =>
		expect(() => verify(value)).not.toThrow()
	);
});
