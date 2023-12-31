"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBuild = exports.installHusky = exports.installCZ = exports.installPrettier = exports.installESLint = void 0;
/**
 * 实现各个功能的安装方法
 */
const shell = require("shelljs");
const fs_1 = require("fs");
const common_1 = require("./common");
const chalk_1 = require("chalk");
/**
 * 安装 ESLint
 */
function installESLint() {
    shell.exec("npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D");
    // 添加 .eslintrc.js
    const eslintrc = `module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
  }
};
  `;
    try {
        (0, fs_1.writeFileSync)("./.eslintrc.js", eslintrc, { encoding: "utf-8" });
    }
    catch (err) {
        (0, common_1.printMsg)(`${(0, chalk_1.red)("Failed to write .eslintrc.js file content")}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)("Please add the following content in .eslintrc.js")}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)(eslintrc)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)("./package.json");
    packageJson.scripts["eslint:comment"] =
        "使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .ts 的文件";
    packageJson.scripts["eslint"] = "eslint --fix src --ext .ts --max-warnings=0";
    (0, common_1.writeJsonFile)("./package.json", packageJson);
}
exports.installESLint = installESLint;
/**
 * 安装 Prettier
 */
function installPrettier() {
    shell.exec("npm i prettier -D");
    // 添加 .prettierrc.js
    const prettierrc = `module.exports = {
  // 一行最多 80 字符
  printWidth: 80,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf'
};
  `;
    try {
        (0, fs_1.writeFileSync)("./.prettierrc.js", prettierrc, { encoding: "utf-8" });
    }
    catch (err) {
        (0, common_1.printMsg)(`${(0, chalk_1.red)("Failed to write .prettierrc.js file content")}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)("Please add the following content in .prettierrc.js")}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)(prettierrc)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)("./package.json");
    packageJson.scripts["prettier:comment"] =
        "自动格式化 src 目录下的所有 .ts 文件";
    packageJson.scripts["prettier"] = 'prettier --write "src/**/*.ts"';
    (0, common_1.writeJsonFile)("./package.json", packageJson);
}
exports.installPrettier = installPrettier;
/**
 * 安装 CZ，规范 git 提交信息
 */
function installCZ() {
    shell.exec("npx commitizen init cz-conventional-changelog --save --save-exact");
    shell.exec("npm i @commitlint/cli @commitlint/config-conventional -D");
    // 添加 commitlint.config.js
    const commitlint = `module.exports = {
  extends: ['@commitlint/config-conventional']
};
  `;
    try {
        (0, fs_1.writeFileSync)("./commitlint.config.js", commitlint, { encoding: "utf-8" });
    }
    catch (err) {
        (0, common_1.printMsg)(`${(0, chalk_1.red)("Failed to write commitlint.config.js file content")}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)("Please add the following content in commitlint.config.js")}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)(commitlint)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)("./package.json");
    packageJson.scripts["commit:comment"] = "引导设置规范化的提交信息";
    packageJson.scripts["commit"] = "cz";
    (0, common_1.writeJsonFile)("./package.json", packageJson);
}
exports.installCZ = installCZ;
/**
 * 安装 husky 和 lint-staged，以实现 git commit 时自动化校验
 * @param hooks，需要自动执行的钩子
 * @param lintStaged，需要钩子运行的命令
 */
function installHusky(hooks, lintStaged) {
    // 初始化 git 仓库
    shell.exec("git init");
    // 在安装 husky 和 lint-staged
    shell.exec("npm i husky lint-staged -D");
    // 设置 package.json
    const packageJson = (0, common_1.readJsonFile)("./package.json");
    packageJson["husky"] = {
        hooks: {
            "pre-commit": "lint-staged",
            ...hooks,
        },
    };
    packageJson["lint-staged"] = {
        "*.ts": lintStaged.map((item) => `npm run ${item}`),
    };
    (0, common_1.writeJsonFile)("./package.json", packageJson);
}
exports.installHusky = installHusky;
/**
 * 安装构建工具，目前主要用于小项目，所以使用 typescript 原生的构建功能即可
 */
function installBuild(feature) {
    // 设置 package.json
    const packageJson = (0, common_1.readJsonFile)("./package.json");
    packageJson.scripts["build:comment"] = "构建";
    let order = "";
    if (feature.includes("ESLint")) {
        order += "npm run eslint";
    }
    if (feature.includes("Prettier")) {
        order += " && npm run prettier";
    }
    order += " && rm -rf lib && tsc --build";
    packageJson.scripts["build"] = order;
    (0, common_1.writeJsonFile)("./package.json", packageJson);
}
exports.installBuild = installBuild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbEZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW5zdGFsbEZlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxpQ0FBaUM7QUFDakMsMkJBQW1DO0FBQ25DLHFDQUE4RTtBQUM5RSxpQ0FBNEI7QUFFNUI7O0dBRUc7QUFDSCxTQUFnQixhQUFhO0lBQzNCLEtBQUssQ0FBQyxJQUFJLENBQ1IsNEVBQTRFLENBQzdFLENBQUM7SUFDRixrQkFBa0I7SUFDbEIsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JoQixDQUFDO0lBQ0YsSUFBSSxDQUFDO1FBQ0gsSUFBQSxrQkFBYSxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBQSxpQkFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsMkNBQTJDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBQSxpQkFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsa0RBQWtELENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkUsSUFBQSxpQkFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxrQkFBa0I7SUFDbEIsTUFBTSxXQUFXLEdBQUcsSUFBQSxxQkFBWSxFQUFjLGdCQUFnQixDQUFDLENBQUM7SUFDaEUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUNuQyx5Q0FBeUMsQ0FBQztJQUM1QyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLDZDQUE2QyxDQUFDO0lBQzlFLElBQUEsc0JBQWEsRUFBYyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1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