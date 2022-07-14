// webpack.base.js

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// console.log("NODE_ENV", process.env.NODE_ENV);
// console.log("API_ENV", process.env.API_ENV);

module.exports = {
	entry: path.join(__dirname, "../src/index.tsx"),
	output: {
		filename: "static/js/[name].js", // 每个输出js的名称
		path: path.join(__dirname, "../dist"), // 打包结果输出路径
		clean: true, // webpack5 之前需要配置clean-webpack-plugin来删除dist文件，webpack5内置：https://webpack.docschina.org/configuration/output/#outputclean
		publicPath: "/", // ? 打包后文件的公共前缀路径 https://webpack.docschina.org/configuration/output/#outputpublicpath
	},
	resolve: {
		extensions: [".js", ".tsx", ".ts"], // 引入模块时不带扩展: https://www.webpackjs.com/configuration/resolve/#resolve-extensions
	},
	module: {
		rules: [
			{
				test: /.(ts|tsx)$/,
				use: "babel-loader",
			},
			// 如果node_moduels中也有要处理的语法，可以把js|jsx文件配置加上
			// {
			//  test: /.(js|jsx)$/,
			//  use: 'babel-loader'
			// }
			{
				test: /.(css|less)$/, // 匹配css文件、less文件
				use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "../public/index.html"),
			inject: true, // 自动注入静态资源
		}),

		// https://www.webpackjs.com/plugins/define-plugin/
		new webpack.DefinePlugin({
			"process.env.API_ENV": JSON.stringify(process.env.API_ENV),
		}),
	],
};
