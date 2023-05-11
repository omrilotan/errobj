import { props } from "./lib/props/index";
import { verify } from "./lib/verify/index";
import { parseStack } from "./lib/parseStack/index";

declare global {
	interface Error {
		toJSON?(): any;
		cause?: unknown;
	}
}

/**
 * Serialise error (1) into a JSONable object. Include fields from an enrichment object (2).
 */
export function errobj(
	error: Error,
	enrichment: { [key: string]: any } = {},
	{ offset = 0, parsedStack = 0 } = {}
): { [key: string]: any } {
	verify(error);

	if (typeof error.toJSON === "function") {
		error = error.toJSON();
	}

	const parsed = parseStack(error, { offset, parsedStack });

	parsedStack && Object.assign(error, { parsedStack: parsed });

	const cause = getCause(error);

	return Object.assign(
		props(error).reduce(
			(accumulator, key) =>
				error[key]
					? Object.assign(accumulator, { [key]: error[key] })
					: accumulator,
			{ ...parsed[0] }
		),
		cause ? { cause } : {},
		enrichment
	);
}

/**
 * Get a string representation of cause property of an error
 */
function getCause(error: Error): string | undefined {
	let { cause } = error;

	if (cause instanceof Error) {
		if (cause === error) {
			cause = "[Circular]";
		} else {
			cause = errobj(cause);
		}
	}

	return typeof cause === "undefined" ? cause : String(cause);
}
