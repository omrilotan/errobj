import { props } from "./index";

describe("props", (): void => {
	it("Should extract property names from error", (): void => {
		const error = new Error("To err is humon");
		expect(props(error)).toContain("message");
	});
	it("Should attach default fields to error", (): void => {
		const error = new TypeError("To err is humon");
		expect(props(error)).toContain("name");
	});
	it("Should leave any other fields attached to error", (): void => {
		const error = new TypeError("To err is humon");
		(error as any).property = "balue";
		expect(props(error)).toContain("property");
	});
});
