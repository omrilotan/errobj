const FIELDS = [

	// Error native getters
	'message',
	'stack',
	'code',

	// inherited (not own property)
	'name',

	// non standard browser fields
	'fileName',
	'lineNumber',
	'columnNumber',

	// SystemError
	'address',
	'dest',
	'errno',
	'info',
	'path',
	'port',
	'syscall',

	// OpenSSL error properties
	'opensslErrorStack',
	'function',
	'library',
	'reason',

	// custom
	'details',
	'description',
];

/**
 * Get property names of an error, including default (not own)
 * @param  {Error} error
 * @return {String[]}
 */
module.exports = error => Array.from(
	new Set(
		Object
			.getOwnPropertyNames(error)
			.concat(FIELDS),
	),
);
