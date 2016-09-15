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