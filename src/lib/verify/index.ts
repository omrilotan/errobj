/**
 * Throws an error unless it accepts an error
 */
export function verify(error: Error): void {
	if (!(error instanceof Error)) {
		throw new RangeError(
			`Expected an error. Insead got ${typeof error}: ${error}`
		);
	}
}
