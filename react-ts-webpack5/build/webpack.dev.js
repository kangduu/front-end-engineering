// webpack.dev.js

const path = require("path");
const { merge } = require("webpack-merge");
const BaseConfig = require("./webpack.base.js");

module.exports = merge(BaseConfig, {
	// mode 开发模式 https://webpack.docschina.org/configuration/mode/
	mode: "development", // 打包快，省去了优化步骤

	// devtool 控制是否生成，以及如何生成 source map。 https://www.webpackjs.com/configuration/devtool/
	devtool: "eval-cheap-module-source-map", //  ? 源码调试模式，

	// devServer https://www.webpackjs.com/configuration/dev-server/
	devServer: {
		port: 8000,
		compress: false, // gzip压缩，开发环境不开启，可提升热更新速度
		hot: true,
		historyApiFallback: true, // 解决history路由404问题 https://www.webpackjs.com/configuration/dev-server/#devserver-historyapifallback
		// static  https://webpack.docschina.org/configuration/dev-server/#devserverstatic
		static: {
			directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
		},
	},
});
