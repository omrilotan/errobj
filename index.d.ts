declare global {
	interface Error {
		toJSON?(): any;
		cause?: unknown;
	}
}
/**
 * Serialise error (1) into a JSONable object. Include fields from an enrichment object (2).
 */
export declare function errobj(
	error: Error,
	enrichment?: {
		[key: string]: any;
	},
	{
		offset,
		parsedStack,
	}?: {
		offset?: number;
		parsedStack?: number;
	}
): {
	[key: string]: any;
};
