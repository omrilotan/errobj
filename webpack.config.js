module.exports = {
	mode: 'production',
	entry: './index.js',
	target: ['web', 'es5'],
	output: {
		filename: 'index.js',
		library: {
			type: 'commonjs2',
		}
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	devtool: 'source-map',
};
