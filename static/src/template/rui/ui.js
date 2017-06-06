/**
 * __componentNameCap__ 组件带默认UI实现文件
 *
 * @module   __componentNameCap__
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'css!./component.css'
    __cacheJS__
], function (
    Component,
    html,
    css
    __cacheName__
) {
    /**
     * __componentNameCap__ UI组件
     *
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    var UxComponent = Component.$extends({
        name: '__componentName__',
        css: css,
        template: html
    });
    /**
     * 需要处理的异步请求
     */
    __cacheCall__

    return UxComponent;
});
