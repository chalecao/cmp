/**
 * __desc__ 组件 __nameCamel__ 带默认UI实现文件
 *
 * @path     pro/__path__
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'css!./component.css'
    __cachePath__
], function (
    Component,
    html,
    css
    __cacheName__
) {
    /**
     * __nameCamel__ UI组件
     *
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    var UxComponent = Component.$extends({
        name: '__name__',
        css: css,
        template: html
    });
    /**
     * 需要处理的异步请求
     */
    __cacheCall__

    return UxComponent;
});
