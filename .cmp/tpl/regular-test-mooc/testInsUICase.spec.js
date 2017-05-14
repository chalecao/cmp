/**
 * Unit UI Test for __name__
 *
 * @author edu <edu@corp.netease.com>
 */
NEJ.define([
    'base/element',
    'base/event',
    'base/util',
    '../component.js',
    './caseIns.js'
], function (
    e,
    v,
    u,
    Component,
    insCases
) {
    // use expect style BDD
    var expect = chai.expect;
    var ut = {};
    /**
     * Regular 组件常规属性验证器初始化
     *
     * @param   {Object} parent - 父元素
     * @param   {Object} sel - 选择器，支持class和id，格式分别为.class 或 #id
     * @returns {Function}     验证执行函数
     */
    ut.getElement = function (parent, sel) {
        sel = sel.trim();
        if ("." === sel[0]) {
            return e._$getByClassName(parent, sel.substr(1)) && e._$getByClassName(parent, sel.substr(1))[0];
        }
        if ("#" === sel[0]) {
            return e._$get(sel.substr(1));
        }
        return null;
    };
    // define component test
    describe('Unit UI Test - __name__', function () {
        // define API test
        describe('Unit UI Test for user Operation', function () {
            var caseName = "shoule act right when ";
            u._$forEach(insCases, function (item) {
                if (item.UIAct && item.UIAct.length) {
                    var inst = new Component({
                        data: item.data
                    }).$inject(document.body);
                    it(caseName + item.UIAct, function (done) {
                        //animate action
                        if (item.UITrigger && item.UITrigger.length) {
                            var selector = item.UITrigger.shift();
                            var element = ut.getElement(inst.parentNode, selector);
                            if (element) {
                                v._$dispatchEvent(element, item.UITrigger[0]);
                            }
                        }
                        //checkout result, may be has animate action, so delay a while.
                        // setTimeout(function () {
                        // check class
                        if (item.UIResult && item.UIResult["hasClass"] && item.UIResult["hasClass"].length) {
                            var classCheckor = item.UIResult["hasClass"];
                            u._$forEach(classCheckor, function (item) {
                                var selector = item.shift();
                                var hasOrNot = item.shift();
                                var element = ut.getElement(inst.parentNode, selector);
                                if (element) {
                                    setTimeout(function () {
                                        if (hasOrNot > 0) {
                                            expect(e._$hasClassName(element, item)).to.be.true;
                                        } else {
                                            expect(e._$hasClassName(element, item)).to.be.false;
                                        }
                                        done();
                                    }, 200);
                                }

                            });
                        }
                        // check style，use math.ceil to handle the animation case
                        if (item.UIResult && item.UIResult["hasStyle"] && item.UIResult["hasStyle"].length) {
                            var styleCheckor = item.UIResult["hasStyle"];
                            u._$forEach(styleCheckor, function (item) {
                                var selector = item.shift();
                                var hasOrNot = item.shift();
                                var element = ut.getElement(inst.parentNode, selector);
                                if (element) {
                                    setTimeout(function () {
                                        if (hasOrNot > 0) {
                                            expect("" + Math.ceil(e._$getStyle(element, item[0].split(":")[0]))).to.eq(item[0].split(":")[1]);
                                        } else {
                                            expect("" + Math.ceil(e._$getStyle(element, item[0].split(":")[0]))).to.not.eq(item[0].split(":")[1]);
                                        }
                                        done();
                                    }, 200);

                                }

                            });
                        }

                        // }, 100);

                    });
                }
            });
        });
    });
});
