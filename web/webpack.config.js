const path = require('path');
const glob = require('glob');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
var WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		dblib: './src/js/dbhelpers.js',
		main: ['./src/js/main.js', './src/styles/sass/application.scss', './src/styles/css/icons.css', './src/styles/css/roboto.css', './src/index.html'],
		'dbupdate.worker': './src/js/dbupdate.worker.js',
		'dbsearch.worker': './src/js/dbsearch.worker.js',
		'serviceworker': './src/serviceworker.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		devtoolModuleFilenameTemplate: info => 'file:///' + path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
	},
	module: {
		rules: [
		{
			test: /index\.html$/,
			use:{
				loader:'file-loader',
				options: {
					name: 'index.html'
				}
			} 
			
		},
		{
			test:/\.html/,
			exclude:/index\.html$/,
			use: 'html-loader'
		},
		{
			test: /\.scss$/,
			use: [	
			{
				loader: 'file-loader',
				options: {
					name: '[name].css'
				}
			},
			'extract-loader',
			'css-loader?-url',
			'sass-loader'
			]
		},
		{
			test: /\.css$/,
			use: [	
			{
				loader: 'file-loader',
				options: {
					name: '[name].css'
				}
			},
			'extract-loader',
			'css-loader?-url'
			]
		},
		{
			test: /\.(png|svg|jpe?g|gif)$/,
			use: [
			{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			}
			]
		}
		]
	},
	plugins: [
	new ManifestPlugin(),
	new CopyPlugin([
	{
		from: 'src/images/',
		to: './images/[name].[ext]',
		toType: 'template'
	},
	{
		from: 'src/styles/webfonts',
		to: './webfonts/[name].[ext]',
		toType: 'template'
	},
	{
		from: 'src/matrusp.webmanifest',
		to: './matrusp.webmanifest',
		toType: 'file'
	}
	]),
	new WebpackAutoInject({
		components: {
			AutoIncreaseVersion: false
		}
	}),
	]
};