## upack API文档

## 用法
```sh
$ upack [option]

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
```

#### upack的默认配置
`upack`的默认配置项：
+ `name`: 执行`upack`命令所在目录
+ `dir`: `components`，组件目录
+ `owner`: `upack-com`
+ `domain`: `http://gitlab.58corp.com`

综上所述：
+ 项目应该配置的项有`name`、`description`、`dir`、`dependencies`、`author`

#### 常用命令介绍
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
