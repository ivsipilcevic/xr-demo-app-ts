const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = (env) => ({
	mode: 'development',
	target: 'web',
	cache: {
		type: 'filesystem',
		allowCollectingMemory: true,
	},
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
		new LiveReloadPlugin({ useSourceHash: true }),
	],
	watch: true,
	output: {
		path: path.resolve(__dirname, env.base_path, 'assets/built/js'),
		filename: '[name].js',
	},
	devtool: 'source-map',
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
							minify: false,
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
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
		modules: ['node_modules'],
	},
	stats: {
		preset: 'summary',
		timings: true,
		warnings: true,
		warningsCount: true,
		errors: true,
	},
});
