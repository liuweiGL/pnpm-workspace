# 使用 pnpm workspace 代替 yarn + learna 的可行性实践

## 优势

1. 更快的包安装速度
2. 更可靠的包引用（不是自己依赖列表的包不能 import）
3. 开发时直接走源码依赖，无需反复编译再测试
4. 无构建依赖之后很多操作可以并行，提高编译效率
5. 可以优化 typescript 类型系统，让整体的类型使用方式保持一致（目前很多模块使用的是 import type，而不是 Formily.xxx）

## 测试步骤

1. 构建

```sh
git clone git@github.com:liuweiGL/pnpm-workspace.git

cd pnpm-workspace

pnpm i

# 正确结果：无依赖错误，构建成功
pnpm run -r --parallel build

```

2. 发布

安装 [verdaccio](https://verdaccio.org/) 用于本地发布测试：

```sh

pnpm add -g verdaccio

# 启动服务
verdaccio

# 更新版本
pnpm run version

# 发布
pnpm -r publish --registry http://localhost:4873/

```

3. 验证

在 `verdaccio\storage` 目录查看包的 `package.json` 可以发现入口信息已经被成功替换，比如 `@formily/core`:

```json
{
	"name": "@formily/core",
	"versions": {
		"2.0.0-beta.78": {
			"name": "@formily/core",
			"version": "2.0.0-beta.78",
			"license": "MIT",
			"main": "lib",
			"publishConfig": {
				"access": "public",
				"main": "lib",
				"module": "esm",
				"umd:main": "dist/formily.core.umd.production.js",
				"unpkg": "dist/formily.core.umd.production.js",
				"jsdelivr": "dist/formily.core.umd.production.js",
				"jsnext:main": "esm",
				"types": "esm/index.d.ts"
			},
			"dependencies": {
				"@formily/reactive": "2.0.0-beta.78",
				"@formily/shared": "2.0.0-beta.78",
				"@formily/validator": "2.0.0-beta.78"
			},
			"scripts": {
				"build": "rimraf -rf lib esm dist && npm run build:cjs && npm run build:esm && npm run build:umd && npm run build:global",
				"build:cjs": "tsc --declaration",
				"build:esm": "tsc --declaration --module es2015 --outDir esm",
				"build:umd": "rollup --config",
				"build:global": "ts-node ../../scripts/build-global",
				"version": "pnpm version"
			},
			"module": "esm",
			"umd:main": "dist/formily.core.umd.production.js",
			"unpkg": "dist/formily.core.umd.production.js",
			"types": "esm/index.d.ts",
			"readmeFilename": "README.md",
			"description": "",
			"_id": "@formily/core@2.0.0-beta.78",
			"_nodeVersion": "16.0.0",
			"_npmVersion": "7.19.1",
			"dist": {
				"integrity": "sha512-x8Nl9YJtDjpOZA3htPfyp1JNGcA0ZamOGhzJ8QWy5C+uXpfbEFn6qldhN+WhzzQEPNKbLnHkrV/5Od1IcUx9Ow==",
				"shasum": "da64e605bbf934530c83bda2b9b57678515d517b",
				"tarball": "http://localhost:4873/@formily/core/-/@formily/core-2.0.0-beta.78.tgz"
			},
			"contributors": []
		}
	},
	"time": {
		"modified": "2021-07-08T18:02:46.251Z",
		"created": "2021-07-08T18:02:46.251Z",
		"2.0.0-beta.78": "2021-07-08T18:02:46.251Z"
	},
	"users": {},
	"dist-tags": {
		"latest": "2.0.0-beta.78"
	},
	"_uplinks": {},
	"_distfiles": {},
	"_attachments": {
		"core-2.0.0-beta.78.tgz": {
			"shasum": "da64e605bbf934530c83bda2b9b57678515d517b",
			"version": "2.0.0-beta.78"
		}
	},
	"_rev": "3-1e293710c9736801",
	"_id": "@formily/core",
	"readme": "# @formily/core\r\n"
}

```
