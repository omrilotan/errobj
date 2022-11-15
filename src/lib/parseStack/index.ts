import errorStackParser from "error-stack-parser";

/**
 * Parse the error stack into a list of frames
 */
export function parseStack(
	error,
	{ offset, parsedStack }: { offset?: number; parsedStack?: number } = {}
): object[] {
	try {
		const parsed = errorStackParser.parse(error);

		// Remove lines off the top of the stack
		if (typeof offset === "number" && offset > 0) {
			parsed.splice(0, offset);
		}

		// trim stack
		if (parsedStack) {
			parsed.length = Math.min(parsed.length, parsedStack);
		}

		return parsed;
	} catch (_) {
		return [{}];
	}
}
