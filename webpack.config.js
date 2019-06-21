const pathFn = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
	mode: isDevelopment ? 'development' : 'production',
	watch: isDevelopment,
	devtool: 'source-map',
	entry: {
		xulib: './src/index',
	},
	output: {
		path: pathFn.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: 'xulib',
		libraryTarget: 'umd',
	},
	module: {
		strictExportPresence: true,
		rules: [{ loader: 'babel-loader', }]
	},
	resolve: {
		extensions: [
			'.tsx', '.ts',
			'.jsx', '.mjs', '.js',
		],
	}
}