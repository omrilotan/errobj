module.exports = {
	mode: 'production',
	entry: './index.js',
	output: {
		filename: 'index.js',
		library: {
			type: 'commonjs2',
		},
	},
	devtool: 'source-map',
};
