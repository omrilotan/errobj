const errorStackParser = require('error-stack-parser');

const parse = errorStackParser.parse.bind(errorStackParser);

/**
 * @param {Error} error
 * @param {number} offset
 * @param {number} parsedStack
 * @returns {object[]}
 */
module.exports = function parseStack(error, { offset, parsedStack } = {}) {
	try {
		const parsed = parse(error);

		// Remove lines off the top of the stack
		if (typeof offset === 'number' && offset > 0) {
			parsed.splice(0, offset);
		}

		if (parsedStack) {

			// Backward compatibility
			if (parsedStack === true) {
				parsedStack = Infinity;
			}

			// trim stack
			parsed.length = Math.min(parsed.length, parsedStack);
		}

		return parsed;
	} catch (_) {
		return [ {} ];
	}
};
