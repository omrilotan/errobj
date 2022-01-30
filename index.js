const props = require('./lib/props');
const verify = require('./lib/verify');
const parseStack = require('./lib/parseStack');

/**
 * Serialise error
 * @param  {Error}  error
 * @param  {Object} [enrichment={}]
 * @param  {Number} [options.offset=0] Number of rows to remove from stack top
 * @param  {Number} [options.parsedStack=0] Add a parsed stack of the error with a certain depth
 * @return {Object}
 */
function errobj(error, enrichment = {}, { offset = 0, parsedStack = 0 } = {}) {
	verify(error);

	if (typeof error.toJSON === 'function') {
		error = error.toJSON();
	}

	const parsed = parseStack(error, { offset, parsedStack });

	parsedStack && Object.assign(error, { parsedStack: parsed });

	const cause = getCause(error);

	return Object.assign(
		props(error).reduce(
			(accumulator, key) => error[key]
				?
				Object.assign(
					accumulator,
					{ [key]: error[key] },
				)
				:
				accumulator,
			{ ...parsed[0] },
		),
		cause ? { cause } : {},
		enrichment,
	);
}

/**
 * @param {Error} error
 * @returns {string}
 */
function getCause(error) {
	let { cause } = error;

	if (cause instanceof Error) {
		if (cause === error) {
			cause = '[Circular]';
		} else {
			cause = JSON.stringify(
				errobj(cause),
			);
		}
	}

	return typeof cause === 'undefined'
		?	cause
		: String(cause);
}

module.exports = errobj;
