type Field =
	| "message"
	| "stack"
	| "code"
	| "name"
	| "fileName"
	| "lineNumber"
	| "columnNumber"
	| "address"
	| "dest"
	| "errno"
	| "info"
	| "path"
	| "port"
	| "syscall"
	| "opensslErrorStack"
	| "function"
	| "library"
	| "reason"
	| "details"
	| "description";

const FIELDS: Field[] = [
	// Error native getters
	"message",
	"stack",
	"code",

	// inherited (not own property)
	"name",

	// non standard browser fields
	"fileName",
	"lineNumber",
	"columnNumber",

	// SystemError
	"address",
	"dest",
	"errno",
	"info",
	"path",
	"port",
	"syscall",

	// OpenSSL error properties
	"opensslErrorStack",
	"function",
	"library",
	"reason",

	// custom
	"details",
	"description",
];

/**
 * Get property names of an error, including sone constructor getters
 */
export const props = (error: Error): string[] =>
	Array.from(new Set(Object.getOwnPropertyNames(error).concat(FIELDS)));
