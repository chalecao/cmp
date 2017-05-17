## CMP = Core Mapping Pages
it's a tool to generate pages, but not limit to page. it can also generate component(UI), module, cache and so on.you can easily make static page with this tool without typing any HTML code or css code or JavaScript code. 

CMP是一个用于制作网页的工具，你可以用它来制作静态网页，也可以制作网页片段比如一个组件，一个UI，或者一个模块，甚至是一个包含数据请求的模块，它能根据你的需求灵活的实现任何事情。目前已经集成模块设计功能，设计模块之后可以一键导出模块所有代码。目前生成组件时支持自动导出测试用例，关于数据mock正在开发中。
其他特点：
1）在线代码与测试用例编辑功能
2）远程SHELL控制台功能

<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/cmp_overview.png" />
 模块设计UMI图：
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/cmp_umi.png" />
 组件设计时序图：
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/cmp_timeline.png" />
 数据mock，实时预览，也可以保存数据到测试用例中，也可以从测试用例中加载数据：
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/cmp_mock.png" />
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/mock.jpg" />
浏览器中跑测试用例：
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/test.jpg" />
 在线代码编辑：
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/cmp_editor.png" />

试用地址: https://chalecao.github.io/cmp/static/

官网及使用手册：[http://cmp.fed123.com/](http://cmp.fed123.com/)

## 本地使用
首先你需要安装cmp，由于cmp和linux 中cmp命令冲突，天噜啦！所以发布的包名改为cmps。执行以下命令：
```
npm install cmps -g
```
查看帮助：
```
cmps --help
```
常用命令：
```
//启动服务, 默认80端口，打开浏览器，打开cmp，后面的参数是开启http服务的目录地址
cmps ./cmp
//启动服务, 默认打开浏览器，打开cmp
cmps ./cmp -p 8088
//启动服务，不打开浏览器
cmps ./cmp -p 8088 -s false
```

## 特性
1. 文件导出功能基于模板规范，默认只能导出基本的html和css，如果需要导出到特定的模板需要首先设置好模板规范，后缀名为cmpt。例如：
```
文件名： /.cmp/index.cmpt
-------------------
[
    {
        "name": "template-name", 
        "desc": "template-desc",
        "misc": "templates中包含name字段的内容会保留在数据模型的meta字段中，可以从文件同步到模型中",
        "templates": [
          {
                "name": "pageJS(存在该字段会保存对应内容到数据模型，可以在cmp中编辑，也可以同步代码)",
                "content": "/.cmp/tpl/ftl-mooc/page.js(读取模板目录)",
                "dest": "/src/javascript/web/pages/__name__/__nameCamel__.js(要写出来的对应文件路径，支持变量替换，目前支持__name__:组件名称 和 __nameCamel__:camel格式的组件名称 )",
                "vars(存放需要替换的变量, 前面是模板中的变量名，后面是替换的内容，default是系统默认数据)": {
                    "__path__": "web/pages/__name__/__nameCamel__",
                    "__desc__": "default",
                    "__cachePath__": "default",
                    "__cacheName__": "default",
                    "__cacheCall__": "default"
                },
                "default(覆盖系统默认数据)": {
                    "__cachePath__": ",\"pro/web/caches/__name__/__nameCamel__Cache\""
                }
            }
            ...
        ]
    }
    ...
]
```
其中，支持"default"替换的系统默认数据如下：
```
_default = {
    __404Path__: "模块化开发中需要配置的404跳转地址",
    __module__: 模块化开发中需要配置的模块路由,
    __html__: 生成的HTML代码片段,
    __css__: 生成的HTML代码片段对应的css,
    __name__: 组件名称,
    __namePrefix__: 组件名称前缀，这里统一组件名称采用-分割，比如组件名称是index-test,那么__namePrefix__就是index,
    __nameSufix__: 组件名称后缀，这里统一组件名称采用-分割，比如组件名称是index-test,那么__nameSufix__就是test,
    __nameCamel__: 组件名称驼峰形式，,
    __desc__: 组件描述,
    __cache__: 依据组件是否有cache来生成，如果包含函数，且函数类型为cache，就会生成cache代码片段,
    __cachePath__: cache代码的默认路径，默认是‘,./cache.js’,
    __cacheName__: cache的名称,默认值",__nameCamel__Cache",
    __cacheCall__: 调用cache的代码片段
};
```
其中cache的片段是根据func-cache元素来生成的，默认支持普通ajax请求和dwr请求，会生成两种请求内容，如下：
```
普通ajax请求：
_p._$__name__ = function (_data, _onLoad) {
        _cache._$request({
            url: '__url__',
            method: '__method__',
            data: _data,
            onload: _onLoad,
            notShowLoading: true
        });
    };
dwr请求：
_p._$__name__ = function (_data, _onLoad) {
        _dwr._$postDWR({
            key: "__name__",
            url: '__url__',
            param: [_data],
            onload: _onLoad,
            notShowLoading: true
        });
    };
```
所以需要在cache模板中提供_cache和_dwr对象来分别处理两种请求。
2. 目前主要的功能是制作页面，附加功能会逐步移到"扩展插件"栏目中。
3. 支持分享制作好的组件，通过导入远程组件即可。同时所有导入的远程组件会保存在“网络组件”列表中。该功能模块目前还在开发中。

## 简单介绍
<img src="https://github.com/chalecao/cmp/raw/master/static/style/images/cmp_intro.png" />
如上图所示，你可以创建一个模块或者UI或者Cache,然后在container中添加图片或者文字等元素，并在右侧控制该元素对应的属性。

[详细使用手册](https://chalecao.gitbooks.io/cmp-manual/content/)

## feature
1. 文件导出支持模板规范，可以自行定义需要导出的模板和规范。支持页面、组件的保存和导出，可以把制作好的页面保存成.cmp格式的文件，使用的时候只要导入即可
2. 支持hover组件，很容易制作出各种hover组件
3. 支付FTL语法嵌套，可以使用include、IF、FOR语句，配合子组件使用。支持FTL导出，导出为依据container提取的name.ftl和name.scss
4. 支持Regular 组件导出，导出文件为component.js component.html component.scss
5. 支持通过函数实现组件嵌套，实现复杂页面。
6. 添加动画函数支持，所有组件都可以添加动画，导出时会智能导出动画相关的css内容。（注意如果嵌套的组件中含有动画，则需要手动下载animate.min.css文件，引入到项目中）
7. 远程控制台功能，可以直接执行远程脚本
8. 在线代码编辑功能，支持编辑组件和模块代码，支持编辑测试用例数据
9. 可视化方式绘制模块的组件关系图，模块时序图（开发中）

## release
### release 2.2.0
1.新增模板规范，用户可以自定义需要导出的文件模板规范，自动导出需要的模板文件。
2.新增网络组件，用户可以分享保存网络组件。
3.新增插件扩展，cmp以后会提供用户自定义的插件方式扩展功能。
4.修改组件池数据模型，删除不需要的数据，模板路径配置移到模板规范中处理。

### release 2.1.0
1.完善数据mock和测试用例功能，用户可以测试组件展示效果，同时在浏览器中跑测试用例。
2.加载组件集时支持基于项目的相对路径。

### release 2.0.0
1.新增mock数据，导出组件测试用例的功能，实时监控组件的mock data数据，用户可以自己模拟数据，也可以将模拟数据保存在测试用例中。
2.新增模块UMI设计功能，每个UMI对应于模块中的一个hash节点界面，主要用于单页系统的设计。
3.新增组件时序图组件，用户可以在设计阶段绘制组件逻辑时序图。
4.函数组件增加else节点，最多可以增加两个else节点。


### release 1.1.0
1.在和其他前端同事讨论的时候，发现了一些问题，于是我主要是代码和设计稿如何同步的问题。如何把生成的HTML和CSS再导回来。目前是无法实现的，因为数据模型导出到HTML和CSS是一个单向的过程。但是我多做了一点工作是先把代码编辑器集成了进来，这样在导出模块之前，至少可以先编辑模块的JS代码逻辑，而不需要导出之后再回到项目中编辑逻辑代码。

2.增加了杀手锏功能，远程SHELL控制台，默认是在启动CMPS的根目录，当你打开某个模块的时候，默认切到模块的根目录，你可以执行远程命令，可以打包、编译CSS等。

3.增加了SPA单页系统模块设计功能，可以直接设计页面的模块构成，一键生成单页系统所需页面以及模块的代码。生成的模块目录结构是根据用户所指定的组件池的FTL、CSS、RUI三个路径共同决定的，这三个路径中需要包含src目录。生成的页面和模块文件都会放在src目录下，给个简单的示例：
```
{
    "name": "p-teacherPage",
    "desc": "老师官方主页",
    "img": "../home/p-teacherPage/example.png",
    "url": "../home/p-teacherPage/p-teacherPage.cmp",
    "ftlPath": "C:/work/edu-mooc-2.0/src/views/web/teacherPage/",
    "cssPath": "C:/work/edu-mooc-2.0/src/scss/web/page/",
    "ruiPath": "C:/work/edu-mooc-2.0/src/javascript/web/module/teacherPage/",
    "postUrl": "/api/p-teacherPage"
}
```

### release 1.0.0
更新了許多，算是一個里程碑的版本。

1.增加JS在线编辑器，保存JS代码到数据模型中。目前代码编辑器还只能编辑js代码。

2.丰富组件池数据模型，示例如下：
```
[
  {
    "name": "u-courseCardWithTime",
    "desc": "带有时间的课程卡片",
    "img": "../index/courseCardWithTime/example.png",
    "url": "../index/courseCardWithTime/u-courseCardWithTime.cmp",
    "ftlPath": "FTL文件夹绝对路径地址/",
    "cssPath": "CSS文件夹绝对路径地址/",
    "ruiPath": "C:/work/edu-mooc-2.0/src/javascript/common/ui/card/courseCardWithTime/",
    "postUrl": "/api/u-courseCardWithTime"
  },
  ...
]
```
增加rui路径和FTL路径，这样可以直接保存组件，不用再麻烦的手动选择保存路径，其中根据之前的rui保存策略，component.js,component.css,component.html,cache.js都是保存在同一个目录的。ftl和css需要分别指定目录。
  
