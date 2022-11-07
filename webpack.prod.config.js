const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => ({
	mode: 'production',
	target: 'web',
	entry: {
		index: [
			'/src/js/index.tsx',
			'/src/css/index.scss',
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '../css/[name].css',
		}),
	],
	output: {
		path: path.resolve(__dirname, env.base_path, 'assets/built/js'),
		filename: '[name].js',
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: '../fonts/[hash][ext][query]',
				},
			},
			{
				test: /\.(png|jpg|gif|webp|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: '../img/[hash][ext][query]',
				},
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'esbuild-loader',
						options: {
							loader: 'tsx', // Or 'ts' if you don't need tsx
							target: 'es2015',
							minify: true,
						},
					},
				],
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
		modules: ['node_modules'],
	},
	optimization: {
		minimize: true,
	},
});
