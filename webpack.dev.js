const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  optimization: {
      minimizer: [
          new UglifyJSPlugin({
              cache: true,
              parallel: true,
              sourceMap: true // set to true if you want JS source maps
          }),
          new OptimizeCSSAssetsPlugin({})
      ]
  },
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',

				options: {
					presets: [
						'env',
						{}
					],

					plugins: ['syntax-dynamic-import']
				}
			},
			{
				test: /\.(scss|css)$/,

				use: [
           MiniCssExtractPlugin.loader,
           { loader: 'css-loader', options: { url: false, sourceMap: true } },
           { loader: 'sass-loader', options: { sourceMap: true } }
        ]
			},
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
		]
	},

	entry: {
		app: './src/app.js',
		vendor: './src/vendor.js'
	},
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "stylesheets/[name].[chunkhash].css",
            chunkFilename: "[id].css"
        })
    ],

	output: {
		filename: 'javascript/[name].[chunkhash].js',
		path: path.resolve(__dirname, 'public')
	},

	mode: 'production',
  devtool: 'source-map',
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 1,
			name: true,

			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				}
			}
		}
	}
};
