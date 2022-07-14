<!-- @format -->

## 初始化

### 目录、配置文件

```yaml
├── build
| ├── webpack.base.js    # 公共配置
| ├── webpack.dev.js     # 开发环境配置
| └── webpack.prod.js    # 打包环境配置
├── public
│ └── index.html         # html 模板
├── src
| ├── App.tsx
│ └── index.tsx          # react 应用入口页面
├── .npmrc               # npm 配置
├── note.md              # 笔记
├── jsconfig.json        # js 配置 todo
├─ .editorconfig         # 编辑器配置（格式化）
├─ .env                  # vite 常用配置
├─ .env.development      # 开发环境配置
├─ .env.production       # 生产环境配置
├─ .env.test             # 测试环境配置
├─ .eslintignore         # 忽略 Eslint 校验
├─ .eslintrc.js          # Eslint 校验配置
├─ .gitignore            # git 提交忽略
├─ .prettierignore       # 忽略 prettier 格式化
├─ .prettierrc.js        # prettier 配置
├─ .stylelintignore      # 忽略 stylelint 格式化
├─ .stylelintrc.js       # stylelint 样式格式化配置
├─ CHANGELOG.md          # 项目更新日志
├─ commitlint.config.js  # git 提交规范配置
├─ lint-staged.config    # lint-staged 配置文件
├─ package-lock.json     # 依赖包包版本锁
├─ package.json          # 依赖包管理
├─ postcss.config.js     # postcss 配置
├─ README.md             # README 介绍
├─ tsconfig.json         # typescript 全局配置
└── package.json    	    # npm-scripts

```

### 安装依赖

- webpack

  ```sh
  npm install webpack webpack-cli -D
  ```

- react

  ```sh
  npm install react react-dom -S

  // ts types
  npm install @types/react @types/react-dom -D
  ```

- react-router-dom

- react-transition-group

### 关于 `public/index.html` 的说明

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>React+TS+Webpack5</title>
	</head>
	<body>
		<div id="root"></div>
	</body>
</html>
```

### `tsconfig.json` 说明

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"lib": ["DOM", "DOM.Iterable", "ESNext"],
		"allowJs": false,
		"skipLibCheck": false,
		"esModuleInterop": false,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react" // react18这里也可以改成react-jsx
	},
	"include": ["./src"]
}
```

## Webpack 配置

### 基础公共配置（webpack.base.js）

1. [入口起点](https://www.webpackjs.com/concepts/entry-points/) 和 [输出](https://www.webpackjs.com/concepts/output/)

   ```js
   const path = require("path");

   module.exports = {
   	entry: path.join(__dirname, "../src/index.tsx"),
   	output: {
   		filename: "static/js/[name].js", // 每个输出js的名称
   		path: path.join(__dirname, "../dist"), // 打包结果输出路径
   		clean: true, // webpack5之前需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
   		publicPath: "/", // 打包后文件的公共前缀路径
   	},
   };
   ```

2. 配置 loader 解析 ts 和 jsx

   ```shell
   npm install babel-loader @babel/core @babel/preset-react @babel/preset-typescript -D
   ```

   ```js
   const path = require("path");

   module.exports = {
   	//...
   	module: {
   		rules: [
   			{
   				test: /.(ts|tsx)$/,
   				use: {
   					loader: "babel-loader",
   					options: {
   						// 预设执行顺序由右往左,所以先处理ts,再处理jsx
   						presets: ["@babel/preset-react", "@babel/preset-typescript"],
   					},
   				},
   			},
   		],
   	},
   };
   ```

3. [extensions](https://www.webpackjs.com/configuration/resolve/#resolve-extensions) 是什么？

   ```js
   const path = require("path");
   const HtmlWebpackPlugin = require("html-webpack-plugin");

   module.exports = {
   	// ...
   	resolve: {
   		extensions: [".js", ".tsx", ".ts"], // 引入模块时不带扩展
   	},
   };
   ```

4. **添加 html-webpack-plugin 插件**

   ```sh
   npm install html-webpack-plugin -D
   ```

   ```js
   const path = require("path");
   const HtmlWebpackPlugin = require("html-webpack-plugin");
   
   module.exports = {
   	// ...
   	plugins: [
   		new HtmlWebpackPlugin({
   			template: path.join(__dirname, "../public/index.html"),
   			inject: true, // 自动注入静态资源
   		}),
   	],
   };
   ```

### 开发环境配置（webpack.dev.js）

```shell
npm install webpack-dev-server webpack-merge -D
```

```js
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
			directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
		},
	},
});
```

在`package.json`中配置脚本 dev

```js
// package.json
"scripts": {
  "dev": "webpack-dev-server -c build/webpack.dev.js"
},
```

### 打包环境配置（webpack.prod.js）

```js
// webpack.prod.js

const { merge } = require("webpack-merge");
const BaseConfig = require("./webpack.base.js");

module.exports = merge(BaseConfig, {
	mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
});
```

在`package.json`中配置脚本 build

```js
// package.json
"scripts": {
  "build": "webpack -c build/webpack.prod.js"
},
```

使用`serve`启动服务运行 dist

```sh
npm install serve -g
```

启动服务：项目根目录下执行`serve -s dist` 或 在 dist 文件目录执行 serve

关闭服务：

## 功能配置

### 环境变量

通过`mode`属性可以区分<u>开发环境</u>和<u>生产环境</u>，这个值可以通过`process.env.NODE_ENV`获取，并且大部分第三方包也是采用的这个环境变量。

重点是我们需要区分**项目业务环境**。通常来讲会包括以下几种环境：

> 开发 > 测试 > 预测 > 正式

我们可以再添加一个环境变量来区分项目的业务环境，通常是`process.env.API_ENV`，这就需要借助[cross-env](https://www.npmjs.com/package/cross-env) 和 [webpack.DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/)设置了。

- **cross-env**：兼容各系统的设置环境变量的包
- **webpack.DefinePlugin**：**webpack**内置的插件,**可以为业务代码注入环境变量**

1. 安装 cross-env

   ```sh
   npm install cross-env -D
   ```

2. 修改**package.json**的**scripts**脚本字段,删除原先的**dev**和**build**,改为

   ```json
   "script":{
   		// dev前缀的表示开发环境，对应的NODE_ENV值设置为development
   		"dev:dev": "cross-env NODE_ENV=development API_ENV=dev webpack-dev-server -c build/webpack.dev.js",
   		"dev:test": "cross-env NODE_ENV=development API_ENV=test webpack-dev-server -c build/webpack.dev.js",
   		"dev:pre": "cross-env NODE_ENV=development API_ENV=pre webpack-dev-server -c build/webpack.dev.js",
   		"dev:prod": "cross-env NODE_ENV=development API_ENV=production webpack-dev-server -c build/webpack.dev.js",

   		// build前缀的表示生产环境，对应的NODE_ENV值设置为production
   		"build:dev": "cross-env NODE_ENV=production API_ENV=dev webpack -c build/webpack.prod.js",
   		"build:test": "cross-env NODE_ENV=production API_ENV=test webpack -c build/webpack.prod.js",
   		"build:pre": "cross-env NODE_ENV=production API_ENV=pre webpack -c build/webpack.prod.js",
   		"build:prod": "cross-env NODE_ENV=production API_ENV=production webpack -c build/webpack.prod.js"
   }
   ```

   `API_ENV=dev/test/pre/production` 对应的业务环境的**开发**/**测试**/**预测**/**正式**环境。

   **注意：** `process.env.NODE_ENV`环境变量**webpack**会自动根据设置的**mode**字段来给业务代码注入对应的`development`和`prodction`，这里在命令中再次设置环境变量`NODE_ENV`是为了<u>在**webpack**和**babel**的配置文件中访问到</u>。

3. 使用[webpack.DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/)将`process.env.API_ENV`注入到业务代码中

   ```js
   // webpack.base.js
    
   const webpack = require("webpack"); 
   
   console.log("NODE_ENV", process.env.NODE_ENV);
   console.log("API_ENV", process.env.API_ENV);
   
   module.exports = {
       // ...
   	plugins: [
           // ...
   		new webpack.DefinePlugin({
   			"process.env.API_ENV": JSON.stringify(process.env.API_ENV),
   		}),
   	],
   };
   ```

   如果一切顺利，你将可以在业务代码中获取到`peocess.env.API_ENV`的值：

   ```js
   // src/index.tsx 
   
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "./App";
   
   console.log("process.env.API_ENV", process.env.API_ENV);  // 这将在控制台打印正确的值
   
   const RootElement = document.getElementById("root");
   if (RootElement) {
   	const root = ReactDOM.createRoot(RootElement);
   	root.render(
   		<React.StrictMode>
   			<App />
   		</React.StrictMode>
   	);
   }
   ```

总结：环境变量的配置，可以通过不同的环境在业务中实现不同的功能，比如根据不同的git分支执行不同的script脚本自动部署不同的环境，而不同的环境，有可能请求的地址不一样，也可以控制那些环境需要日志信息等待。

### CSS 样式相关配置

```sh
npm install style-loader css-loader -D
```

- **style-loader**: 把解析后的**css**代码从**js**中抽离,放到头部的**style**标签中(在运行时做的)
- **css-loader:** 解析**css**文件代码

```js
module.exports = { 
	module: {
		rules: [
			{
				test: /.css$/, // 匹配css文件
				use: ["style-loader", "css-loader"],
			},
		],
	}, 
};
```

#### 配置支持less、sass

```sh
npm install less-loader less -D
```

```js
module.exports = { 
	module: {
		rules: [
			{
				test: /.(css|less)$/, // 匹配css文件和less文件
				use: ["style-loader", "css-loader", "less-loader"],
			},
		],
	}, 
};
```

#### 添加CSS3前缀以处理兼容问题

```sh
npm install postcss-loader autoprefixer -D
```

- **postcss-loader**：处理**css**时自动加前缀
- **autoprefixer**：决定添加哪些浏览器前缀到**css**中

```js
module.exports = { 
	module: {
		rules: [ 
			{
				test: /.(css|less)$/, // 匹配css文件、less文件
				use: [
					"style-loader",
					"css-loader",
+					{
+						loader: "postcss-loader",
+						options: {
+							postcssOptions: {
+								plugins: ["autoprefixer"],
+							},
+						},
+					},
					"less-loader",
				],
			},
		],
	},
};
```

执行`npm run build:dev` 就可以在head的style标签中看到了。

**也可以在根目录下新建`postcss.config.js`进行配置**

```js
// postcss.config.js
module.exports = {
    plugins: ["autoprefixer"],
};


// webpack.base.js
module.exports = { 
    module: {
        rules: [ 
            {
                test: /.(css|less)$/, // 匹配css文件、less文件
                use: [
                    "style-loader",
                    "css-loader",
+					"postcss-loader",
                    "less-loader",
                ],
            },
        ],
    },
};
```

关于`.browserslistrc`文件的配置说明：[参考](https://juejin.cn/post/6844903669524086797)

不配置默认为：**> 0.5%, last 2 versions, Firefox ESR, not dead**

```bash
# .browserslistrc

last 1 version
> 1%
maintained node versions
not dead
```

减少项目的配置文件，也可以在`package.json`文件中设置

```json
{
    "browserslist": [
        "last 1 version",
        "> 1%",
        "IE 10"
    ]
}
```

### 复制public文件

一般**public**文件夹都会放一些静态资源,可以直接根据绝对路径引入,比如**图片**,**css**,**js**文件等,不需要**webpack**进行解析,只需要打包的时候把**public**下内容复制到构建出口文件夹中,可以借助[copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin)插件。

```sh
npm install copy-webpack-plugin -D
```

开发环境已经在**devServer**中配置了**static**托管了**public**文件夹，在开发环境使用绝对路径可以访问到**public**下的文件，

```js
// webpack.dev.js

const path = require("path");
const { merge } = require("webpack-merge");
const BaseConfig = require("./webpack.base.js");

module.exports = merge(BaseConfig, { 
	// devServer https://www.webpackjs.com/configuration/dev-server/
	devServer: {
        // ...
		// static  https://webpack.docschina.org/configuration/dev-server/#devserverstatic
		static: {
			directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
		},
	},
});
```

但打包构建时不做处理会访问不到，所以现在需要在打包配置文件**webpack.prod.js**中新增**copy**插件配置。

```js
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

// 在上面的配置中,忽略了index.html,因为html-webpack-plugin会以public下的index.html为模板生成一个index.html到dist文件下,所以不需要再复制该文件了。
```



### 资源文件

#### 处理图片文件

#### 处理字体和媒体文件

### babel 预设处理 JavaScript 相关问题

现在**JavaScript**不断新增很多方便好用的标准语法来方便开发，甚至还有非标准语法，比如装饰器，都极大的提升了代码可读性和开发效率。但前者标准语法很多低版本浏览器不支持，后者非标准语法所有的浏览器都不支持。需要把最新的标准语法转换为低版本语法，把非标准语法转换为标准语法才能让浏览器识别解析，而**babel**就是来做这件事的，详细可以看[Babel 那些事儿](https://juejin.cn/post/6992371845349507108)。 

```sh
npm install babel-loader @babel/core @babel/preset-env core-js -D
```

1. `babel-loader`: 使用 **babel** 加载最新JavaScript代码并将其转换为 **ES5**
2. `@babel/core`: **babel** 编译的核心包
3. `@babel/preset-env`: **babel** 编译的预设,可以转换目前最新的**JavaScript**标准语法
4. `core-js`: 使用低版本**JavaScript**语法模拟高版本的库,也就是垫片

#### JavaScript语法兼容性处理

在 `webpack.base.js` 配置文件中添加

```js
// webpack.base.js
module.exports = { 
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        // 预设执行顺序由右往左,所以先处理ts，再处理jsx，最后再试一下babel转为低版本语法
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找配置好的文件.browserslistrc 或 package.json
                                    // "targets": {
                                    //  "chrome": 35,
                                    //  "ie": 9
                                    // },
                                    useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                                    corejs: 3, // 配置使用core-js低版本
                                },
                            ],
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            }, 
        ],
    }, 
};
```

也可以单独设置`babel.config.js`文件，

> 为了避免**webpack**配置文件过于庞大,可以把**babel-loader**的配置抽离出来, 新建**babel.config.js**文件,使用**js**作为配置文件,是因为可以访问到**process.env.NODE_ENV**环境变量来区分是开发还是打包模式。

```js
// babel.config.js
module.exports = {
	// 预设执行顺序由右往左,所以先处理ts，再处理jsx，最后再试一下babel转为低版本语法
	presets: [
		[
			"@babel/preset-env",
			{
				// 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找配置好的文件.browserslistrc 或 package.json
				// "targets": {
				//  "chrome": 35,
				//  "ie": 9
				// },
				useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
				corejs: 3, // 配置使用core-js低版本
			},
		],
		"@babel/preset-react",
		"@babel/preset-typescript",
	],
};
```

```js
// webpack.base.js
module.exports = { 
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
		],
	}, 
};
```

#### JavaScript非标准语法处理

tyepscript为class增加了装饰器功能，但是我们想在react中使用的话，应该怎么处理啦？

##### 添加ts的装饰器功能

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    // 开启装饰器使用
    "experimentalDecorators": true /* Enables experimental support for ES7 decorators. */
  }
}
```

**虽然你开启了装饰器，但是JavaScript标准语法不支持装饰器，所以编译器会提示语法错误，运行代码也会报错**

解决办法：添加`@babel/plugin-proposal-decorators`依赖，

```sh
npm install @babel/plugin-proposal-decorators -D
```

在`babel.config.js`中设置：

```js
//babel.config.js
module.exports = { 
  // ...
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```

**编译器语法提示：** 编译器的错误语法提示如何解决？VSCode设置中搜索`experimentalDecorators`,勾选。



