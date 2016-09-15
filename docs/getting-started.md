## Getting Started

#### 1. 全局安装 upack：
```sh
$ sudo npm install --global upack
or
$ sudo cnpm install --global upack (推荐)
```
参考: 配置 [cnpm](http://gulpjs.com/plugins/)
#### 2. 配置upack：
首次执行`upack`命令，会提示输入`用户名`、`邮箱`和`Gitlab Token`。
```sh
$ upack
INFO  用户配置文件未找到，初始化"~/.upackrc"
? 请输入您的用户名: xxx
? 请输入您的邮箱: xxx@xx.com
? 请输入您的Gitlab token: ********************
INFO  完成初始化用户配置文件
```
输入以上信息后，用户信息会被保存到`~/.upackrc`文件中，以后每次执行`upack`都会读取`~/.upackrc`中的用户配置

除此之外，还需要配置`Gitlab`的`API`地址和默认组件所属的用户/组 (公司内部使用默认配置即可)
例如，`Gitlab`的地址为`https://gitlab.example.com`，默认组件的仓库都放下`upack-com`下，那么还需执行：
```sh
$ upack p -D "domain=https://gitlab.example.com&owner=upack-com"
```
#### 3. 组件创建和发布：
用于创建/发布公共组件

在Gitlab上创建工程,并clone到本地
```sh
$ git clone git@gitlab.com:xxx/xxx.git
```
进入到组件工程,进行初始化
```sh
$ upack init --component
```
提交代码,同步远程仓库
```sh
$ git add --all && git commit && git push
```
创建tag
```sh
$ upack run patch | <minor> | <major>
```
#### 4. 项目工程创建和组件安装：
用于创建项目的工程,并进行组件安装

在Gitlab上创建工程,并clone到本地
```sh
$ git clone git@gitlab.com:xxx/xxx.git
```
进入到项目工程,进行初始化
```sh
$ upack init --project
$ sudo npm install
or
$ sudo cnpm install (推荐)
```
安装组件
```sh
$ upack install xxx
```

### 更多
更多请参看[API文档](API.md)

