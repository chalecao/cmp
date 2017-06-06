/*
 * __pDesc__模块
 * @path   __path0__/module/__path1__/__pName__
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'pool/module-base/src/base',
    'base/element',
    'base/util',
    'util/template/tpl',
    'util/template/jst'
], function (
    _klass,
    _module,
    _element,
    _util, _tpl, _jst,
    exports, _pro) {

    var g = window;

    /**
     * 页面模块实现类
     *
     * @class   _$$Module
     * @extends pro/common/module._$$Module
     * @param  {Object} options - 模块输入参数
     */
    var ModuleIns = _klass._$klass();
    _pro = ModuleIns._$extend(m.Module);

    /**
     * 构建模块，这部分主要完成以下逻辑：
     * 
     * * 构建模块主体DOM树结构
     * * 初始化使用的依赖组件的配置信息（如输入参数、回调事件等）
     * * 一次性添加的事件（即模块隐藏时不回收的事件）
     * * 后续用到的节点缓存（注意如果第三方组件配置信息里已经缓存的节点不需要再额外用变量缓存节点）
     *
     * 在UMI配置时的 config 配置直接做为 _doBuild 的输入参数
     * @return {String}
     */
    _pro._doBuild = function () {
        var _body = 'j-__pName__-body';
        this.__super(_tpl._$getTextTemplate(_body) || _jst._$get(_body), {
            parent: 'j-__parentM__-content'
        });
    };


    /**
     * 1.组装分配第三方组件，形成完整的模块结构
     * 2.添加模块生命周期内DOM事件，模块隐藏时回收
     * @param {Object} _options 模块配置参数
     * @return {Void}
     */
    _pro._onShow = function (_options) {
        this.__super(_options);
    };

    /**
     * 接受到消息触发事件，子类实现具体逻辑
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro._onMessage = function (_action) {

    };

    /**
     * 1.根据输入信息加载数据
     * 2.需要数据才能构造的第三方组件的分配和组装
     * @param {Object} _options 模块配置参数
     * @return {Void}
     */
    _pro._onRefresh = function (_options) {
        this.__super(_options);
    };

    /**
     * 1.回收分配的NEJ组件，基类已处理
     * 2.回收所有分配的Regular组件，基类已处理
     * 3.回收所有添加的生命周期事件，基类已处理
     * 4.确保onhide之后，组件状态同onshow一致
     * @return {Void}
     */
    _pro._onHide = function () {
        this.__super();
    };

    //加载此模块
    g.dispatcher._$loaded("__modulePath__", ModuleIns);

    exports.ModuleIns = ModuleIns;
});
