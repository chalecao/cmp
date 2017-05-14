/*
 * __desc__页面
 * 
 * @path pro/__path__
 */
NEJ.define([
    'base/klass',
    'pro/common/page'
    __cachePath__
], function (k,
    _$$Page
    __cacheName__
) {
    /**
     * 页面模块实现类
     *
     * @class   _$$page
     * @extends pro/common/module._$$page
     * @param  {Object} options - 模块输入参数
     */
    var p, pro;
    p._$$page = k._$klass();
    pro = p._$$page._$extend(_$$Page);

    /**
     * 模块初始化
     * @private
     * @param  {Object} options - 输入参数信息
     * @return {Void}
     */
    pro.__init = function (options) {
        this.__super(options);
        
        __cacheCall__
    };

    /**
     * 模块重置逻辑
     * @private
     * @param  {Object} options - 输入参数信息
     * @return {Void}
     */
    pro.__reset = function (options) {
        this.__super(options);
    };
    /**
     * 模块销毁逻辑
     * @private
     * @return {Void}
     */
    pro.__destroy = function () {
        this.__super();
    };

    return p._$$page;
});
