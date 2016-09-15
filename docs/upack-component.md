## upack-component

#### component.json
`component.json`配置文件用于管理项目中的组件依赖，每个组件中也有一个`component.json`，项目初始化时可以自动生成，也可以手动编写。

+ `name`: 名称，请和Gitlab项目名称保持一致，自动生成时默认取所在目录的名字
+ `description`: 描述，请用简洁的语言描述项目或者组件
+ `version`: 版本号，**仅适用于组件**
+ `dependencies`: 依赖的组件
+ `dir`: 组件安装的目录，**仅适用于项目**
+ `author`: 组件作者信息
+ `main`: 入口文件，**仅适用于组件**
+ `exclude`: 安装时排除的文件和目录，仅适用于组件，配置规则可以参考[node-glob](https://github.com/isaacs/node-glob)

综上所述：
+ 组件应该配置的项有`name`、`description`、`version`、`main`、`author`、`dependencies`、`exclude`
