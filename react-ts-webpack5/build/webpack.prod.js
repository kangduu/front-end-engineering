// webpack.prod.js

const path = require("path");
const { merge } = require("webpack-merge");
const BaseConfig = require("./webpack.base.js");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(BaseConfig, {
	mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "../public"), // 复制public下文件
					to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
					filter: source => {
						return !source.includes("index.html"); // 忽略index.html
					},
				},
			],
		}),
	],
});