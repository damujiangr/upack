# upack
A integration tool, component management & project generator & project build workflow.

---
## 简介
`upack`是一个前端开发的集成工具，包含依托于[Gitlab](https://about.gitlab.com/)的组件管理（forked from icefox0801/fecom）、web app项目脚手架和基于Gulp的工作流。

## 安装
```
[sudo] npm install -g upack
```

## 配置
首次执行`upack`命令，会提示输入`用户名`、`邮箱`和`Gitlab Token`。

```
RamboMac:~ rambo$ upack
20:23:42 INFO  用户配置文件未找到，初始化"~/.upackrc"
? 请输入您的用户名: damujiangr
? 请输入您的邮箱: ramboyan@aliyun.com
? 请输入您的Gitlab token: ********************
20:24:51 INFO  完成初始化用户配置文件
```
输入以上信息后，用户信息会被保存到`~/.upackrc`文件中，以后每次执行`upack`都会读取`~/.upackrc`中的用户配置

除此之外，还需要配置`Gitlab`的`API`地址和默认组件所属的用户/组。例如，`Gitlab`的地址为`https://gitlab.example.com`，默认组件的仓库都放下`fe-group`下，那么还需执行：
```
RamboMac:~ rambo$ upack p -d "domain=https://gitlab.example.com&owner=fe-group"
```

## 用法
  Usage: upack [options]


  Commands:

    init [options]                         初始化组件
    install|i [options] [component...]     安装组件
    uninstall|un [options] <component...>  卸载组件
    list|ls [options] [component...]       列出组件版本
    info <component>                       显示组件的详细信息
    link [component]                       链接组件
    search|s [options] <pattern>           搜索组件
    profile|p [options] [query]            管理用户配置
    tree|t [options] [component...]        打印组件依赖树
    version|v [options] [releaseType]      组件版本更新
    update|u [component...]                更新组件

  A magic component management tool

  Options:

    -h, --help  output usage information

## component.json
`component.json`配置文件用于管理项目中的组件依赖，每个组件中也有一个`component.json`，项目初始化时可以自动生成，也可以手动编写。

+ `name`: 名称，请和[Gitlab](https://about.gitlab.com/)项目名称保持一致，自动生成时取所在目录的名字
+ `description`: 描述，请用简洁的语言描述项目或者组件
+ `version`: 版本号，**仅适用于组件**
+ `dependencies`: 依赖的组件
+ `dir`: 组件安装的目录，**仅适用于项目**
+ `author`: 组件作者信息
+ `main`: 入口文件，**仅适用于组件**
+ `exclude`: 安装时排除的文件和目录，仅适用于组件，配置规则可以参考[node-glob](https://github.com/isaacs/node-glob)

`upack`的默认配置项：
+ `name`: 执行`upack`命令所在目录
+ `dir`: `components`，组件目录
+ `owner`: `fecom-fe`，（后续会更新为`upack-com`）
+ `domain`: `http://gitlab.58corp.com`

综上所述：

+ 项目应该配置的项有`name`、`description`、`dir`、`dependencies`、`author`
+ 组件应该配置的项有`name`、`description`、`version`、`main`、`author`、`dependencies`、`exclude`

## 常用命令介绍
+ `upack init`: 初始化组件的目录结构

 * `-A | --all`: (默认)所有问题都通过问答生成`component.json`，`-S | --skip`: 跳过所有问题直接通过默认配置生成`component.json`。
 * `-P | --project`:天玑项目脚手架，`-C | --component`:组件项目脚手架；生成的package.json文件可以根据需要自行配置。
+ `upack install`: 安装`component.json`中`dependencies`项所指定的所有组件
+ `upack install compA`: 安装`compA`组件以及它的依赖，并保存到`component.json`中
+ `upack link`: 将当前目前的组件注册为全局的链接，以便进行本地开发
+ `upack link compA`: 软链接`components/compA`到全局注册的`compA`组件目录
+ `upack uninstall compA`: 卸载`compA`组件以及它的依赖
+ `upack update compA`: 更新`compA`到最新版本，只更新`compA`本身
+ `upack info compA`: 显示`compA`的详细信息以及版本更新历史
+ `upack list`: 列出本地安装的所有组件，如果指定`-U`参数则检查是否有更新
+ `upack list compA`: 列出本地安装的`compA`组件，如果指定`-U`参数则检查是否有更新
+ `upack search compA`: 按照`compA`搜索`Gitlab`中的组件，如果指定`-O`参数则按用户/组搜索
+ `upack profile`: 列出用户配置
+ `upack profile "username=damujaingr"`: 以`query`形式设置用户配置项
+ `upack profile -D "domain=https://gitlab.example.com"`: 以`query`形式设置`upack`默认配置项
+ `upack tree`: 以依赖树的形式列出本地安装的所有组件
+ `upack tree compA`: 以依赖树的形式列出本地安装的`compA`组件，如果指定`-R`参数，则列出远程`compA`组件的依赖树
+ `upack version`: 提示选择并更新组件的版本号，会更新`component.json`中的`version`和自动添加`tag`，注意还需执行`git push --follow-tags`来推送到远程仓库
+ `upack version patch`: 以`patch`类型更新组件版本号，类型也可以为`minor`或者`major`

## 组件安装格式
组件名称格式 `[source:][owner/]name[@version][?args]`，以`group/compA`为例
+ `upack install compA`
+ `upack install group/compA`
+ `upack install group/compA@1.8.3`

组件示例可以参考：[https://gitlab.com/u/icefox0801/projects](https://gitlab.com/u/icefox0801/projects)

## 构建流程
为了更好的适配PC和M项目，构建任务被划分为四份：`build-m-dev.js`、`build-m-dist.js`、`build-pc-dev.js`、`build-pc-dist.js`；在`gulpfile.js`中通过`gulp-hub`引入

gulpfile.js
```
/**
 * 构建的配置文件
 */
var config = {
    "mode": "m" //项目的模式<m>|<pc>
};

/**
 * use the external task
 */
hub(['task/build-' + config.mode + '-*.js']);
```
构建命令
+ `gulp dev`: 执行开发模式下的构建任务
+ `gulp dist`: 执行生产模式下的构建任务

具体可以参见[构建工程说明branch-stratery-single](http://gitlab.58corp.com/hrg-fe-zhaopin/branch-strategy-single)[暂时只对内部员工开放]
