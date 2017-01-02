/**
 * __componentNameCap__ 组件实现文件
 *
 * @version  1.0
 * @author   hzcaohuanhuan <hzcaohuanhuan@corp.netease.com>
 * @module   __componentNameCap__
 */
NEJ.define([
    'text!./component.html',
    'text!./component.css',
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'base/element',
    'base/event'
    __cacheJS__
], function(
    html,
    css,
    Component,
    util,
    e,
    v
    __cacheName__
) {

    /**
     * __componentNameCap__ 组件
     *
     * @class   module:__componentNameCap__
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var __componentNameCap__ = Component.$extends({
        name: '__componentName__',
        css: css,
        template: html,
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:__componentNameCap__#config
         * @returns {void}
         */
        config: function() {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {

            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {

            });

            this.supr();
            // TODO
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:__componentNameCap__#init
         * @returns {void}
         */
        init: function() {
            // TODO
            this.supr();

            __cacheCall__

        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:__componentNameCap__#destroy
         * @returns {void}
         */
        destroy: function() {
            // TODO
            this.supr();
        }
    });

    return __componentNameCap__;
});
