import { errobj } from "./index";

const [major, minor] = process.versions.node.split(".").map(Number);
const supportsCause = major > 16 || (major === 16 && minor >= 9);

declare global {
	interface Error {
		[key: string]: any;
	}
}

describe("errobj", (): void => {
	it("Should convert an error to an object", (): void => {
		const error = new Error("Everything is okay");

		const obj = errobj(error);
		expect(obj.toString()).toBe("[object Object]");
	});
	it("Should include all error fields", (): void => {
		const error = new TypeError("Nothing");
		error.details = { answer: 42 };
		error.code = "UNKNERR";
		const obj = errobj(error);
		expect(obj.message).toBe("Nothing");
		expect(obj.name).toBe("TypeError");
		expect(obj.code).toBe("UNKNERR");
		expect(obj.details).toHaveProperty("answer");
		expect(typeof obj.stack).toBe("string");
	});
	it("Should include any custom property attached to the error", (): void => {
		const error = new RangeError("Nothing");
		error.extra = "information";
		const { extra } = errobj(error);
		expect(extra).toBe("information");
	});
	it("Should include enrichment fields", (): void => {
		const error = new RangeError("Nothing");
		const { extra } = errobj(error, { extra: "information" });
		expect(extra).toBe("information");
	});
	it("Should give precedence to enrichment fields over the native ones", (): void => {
		const error = new RangeError("Nothing");
		const { message } = errobj(error, { message: "Something" });
		expect(message).toBe("Something");
	});
	it("Should find line and column from browser error stack", (): void => {
		const error = new RangeError("Nothing");
		error.stack = `ReferenceError: something is not defined
at change (index.html:46)
at index.html:53
at index.html:56`;
		const { fileName, lineNumber, columnNumber } = errobj(error);
		expect(fileName).toBe("index.html");
		expect(lineNumber).toBe(46);
		expect(columnNumber).toBeUndefined();
	});
	it("Should not attach parsedStack by default", (): void => {
		const error = new RangeError("Nothing");
		error.stack = `ReferenceError: something is not defined
at change (index.html:46)
at index.html:53
at index.html:56`;
		const { parsedStack } = errobj(error);
		expect(parsedStack).toBeUndefined();
	});
	it("Should attach specific lines to parsedStack to the details", (): void => {
		const error = (): Error => {
			const err = new RangeError("Nothing");
			err.stack = `ReferenceError: something is not defined
at change (index.html:46)
at index.html:53
at index.html:56`;
			return err;
		};
		expect(
			errobj(error(), null, { parsedStack: Infinity }).parsedStack.length
		).toBe(3);
		expect(errobj(error(), null, { parsedStack: 2 }).parsedStack.length).toBe(
			2
		);
		expect(
			errobj(error(), null, { parsedStack: 0 }).parsedStack
		).toBeUndefined();
	});
	it("Should find line and column from nodejs error stack", (): void => {
		const error = new RangeError("Nothing");
		error.stack = `at /app/dist/apps/listings/server.js:1329:40
at Array.filter (<anonymous>)
at Object.category (/app/dist/apps/listings/server.js:1327:37)
at buildSubCategoryFilter (/app/dist/apps/listings/server.js:40171:31)
at buildAppFilters (/app/dist/apps/listings/server.js:40145:18)
at Object.listingsResult (/app/dist/apps/listings/server.js:29813:22)
at /app/dist/apps/listings/server.js:27177:21
at process._tickCallback (internal/process/next_tick.js:68:7)`;
		const { fileName, lineNumber, columnNumber } = errobj(error);
		expect(fileName).toBe("/app/dist/apps/listings/server.js");
		expect(lineNumber).toBe(1329);
		expect(columnNumber).toBe(40);
	});
	it("Should find line and column from browser error stack", (): void => {
		const error = new RangeError("Nothing");
		error.stack = `TypeError: Cannot read property 'gf' of undefined
at t.r.getPageLoadTime (https://cdn.website.com/assets/application.js:1:284663)
at d (https://cdn.website.com/assets/business-logic.js:1:286145)
at https://connect.facebook.net/en_US/fbevents.js:25:21849
at HTMLIFrameElement.b (https://connect.facebook.net/en_US/fbevents.js:24:3061)`;
		const { fileName, lineNumber, columnNumber } = errobj(error);
		expect(fileName).toBe("https://cdn.website.com/assets/application.js");
		expect(lineNumber).toBe(1);
		expect(columnNumber).toBe(284663);
	});
	it("Should prefer existing lineNumber and columnNumber", (): void => {
		const error = new RangeError("Nothing");
		error.lineNumber = 2;
		error.columnNumber = 4;
		error.stack = `TypeError: Cannot read property 'gf' of undefined
at t.r.getPageLoadTime (https://cdn.website.com/assets/application.js:1:284663)
at d (https://cdn.website.com/assets/business-logic.js:1:286145)
at https://connect.facebook.net/en_US/fbevents.js:25:21849
at HTMLIFrameElement.b (https://connect.facebook.net/en_US/fbevents.js:24:3061)`;
		const { lineNumber, columnNumber } = errobj(error);
		expect(lineNumber).toBe(2);
		expect(columnNumber).toBe(4);
	});
	it("Should offset the parsed stack trace", (): void => {
		const error = new RangeError("Nothing");
		error.stack = `TypeError: Cannot read property 'gf' of undefined
at t.r.getPageLoadTime (https://cdn.website.com/assets/application.js:1:284663)
at d (https://cdn.website.com/assets/business-logic.js:4:286145)
at https://connect.facebook.net/en_US/fbevents.js:25:21849
at HTMLIFrameElement.b (https://connect.facebook.net/en_US/fbevents.js:24:3061)`;
		let lineNumber, columnNumber;
		({ lineNumber, columnNumber } = errobj(error, null, { offset: 1 }));
		expect(lineNumber).toBe(4);
		expect(columnNumber).toBe(286145);

		({ lineNumber, columnNumber } = errobj(error, null, { offset: 2 }));
		expect(lineNumber).toBe(25);
		expect(columnNumber).toBe(21849);
	});
	it("Should support errors with a toJSON function", (): void => {
		class CustomError extends Error {
			override toJSON() {
				return {
					message: "Custom wrong thing",
					stack: this.stack,
				};
			}
		}

		const error = new CustomError("Something must have gone terribly wrong");
		error.stack = `TypeError: Cannot read property 'gf' of undefined
at t.r.getPageLoadTime (https://cdn.website.com/assets/application.js:1:284663)
at d (https://cdn.website.com/assets/business-logic.js:1:286145)
at https://connect.facebook.net/en_US/fbevents.js:25:21849
at HTMLIFrameElement.b (https://connect.facebook.net/en_US/fbevents.js:24:3061)`;

		const { message, lineNumber, columnNumber, extra } = errobj(error, {
			extra: "additional info",
		});
		expect(message).toBe("Custom wrong thing");
		expect(lineNumber).toBe(1);
		expect(columnNumber).toBe(284663);
		expect(extra).toBe("additional info");
	});
	if (!supportsCause) {
		return;
	}
	it("should print cause string", (): void => {
		const error = new Error("Something must have gone terribly wrong", {
			cause: "something horrible",
		});
		const { cause } = errobj(error);
		expect(cause).toBe("something horrible");
	});
	it("should print cause string", (): void => {
		const error = new Error("Something must have gone terribly wrong");
		expect(Object.keys(errobj(error))).not.toHaveProperty("cause");
	});
	it("should parse cause error", (): void => {
		const err = new Error("something horrible");
		const error = new Error("Something must have gone terribly wrong", {
			cause: err,
		});
		const original = errobj(err);
		const { cause } = errobj(error);
		expect(cause).toBe(JSON.stringify(original));
	});
	it("should escape circular reference in cause", (): void => {
		const error = new Error("Something must have gone terribly wrong");
		error.cause = error;
		const { cause } = errobj(error);
		expect(cause).toBe("[Circular]");
	});
});
