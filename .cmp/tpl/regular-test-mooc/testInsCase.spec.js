/**
 * Unit Test for __name__
 */
NEJ.define([
    'base/util',
    '../component.js',
    './caseIns.js',
    './caseApi.js',
    './caseEvt.js'
], function (
    u,
    Component,
    insCases,
    apiCases,
    evtCases
) {
        // use expect style BDD
        var expect = chai.expect;
        var ut = {};
        /**
         * Regular 组件常规属性验证器初始化
         *
         * @param   {Object} def - 默认属性信息
         * @param   {Object} ret - 待验证结果
         * @returns {Function}     验证执行函数
         */
        ut.setupProChecker = function (def, ret) {
            ret = u._$merge({}, def, ret);
            return function (expect, inst) {
                u._$forIn(ret, function (value, key) {
                    expect(inst.data[key]).to.eql(value, key);
                });
            };
        };
        /**
         * Regular 组件计算属性验证器初始化
         *
         * @param   {Object} def - 默认属性信息
         * @param   {Object} ret - 待验证结果
         * @returns {Function}     验证执行函数
         */
        ut.setupComputedChecker = function (def, ret) {
            ret = u._$merge({}, def, ret);
            return function (expect, inst) {
                u._$forIn(ret, function (value, key) {
                    expect(inst.$get(key)).to.eql(value, key);
                });
            };
        }
        // define ALL test
        describe('Unit Test for component __name__', function () {
            // define instance test
            describe('Unit Test for New Instance', function () {
                // FIXME set default value config
                var defPro = {},
                    defCpt = {};
                // instance Base
                var caseName = "shoule be ok for new instance with data";
                u._$forEach(insCases, function (item) {
                    if (item.staticInsApi && item.staticInsApi.length) {
                        caseName = "shoule be ok for static new instance api" + item.staticInsApi;
                    }
                    it(caseName, function () {
                        var inst = "";
                        // static instance or not
                        if (item.staticInsApi && item.staticInsApi.length) {
                            Component[staticInsApi]({
                                data: item.data
                            });
                        } else {
                            inst = new Component({
                                data: item.data
                            });
                        }
                        expect(inst).to.be.an.instanceof(Component);
                        // check property
                        ut.setupProChecker(defPro, item.expPro)(expect, inst);
                        // check computed property
                        ut.setupComputedChecker(defCpt, item.expCpt)(expect, inst);
                    });
                });
            });

            // define API test
            describe('Unit Test for Used API', function () {
                var defPro = {},
                    defCpt = {};
                var caseName = "shoule be ok for instance API ";
                u._$forEach(apiCases, function (item) {
                    if (item.api && item.api.length) {
                        it(caseName + item.api, function () {
                            var inst = new Component({
                                data: item.data
                            });
                            if (item.expReturn) {
                                expect(inst[item.api].apply(inst, item.params || [])).to.eql(item.expReturn);
                            } else {
                                inst[item.api].apply(inst, item.params || []);
                            }
                            ut.setupProChecker(defPro, item.expPro)(expect, inst);
                            ut.setupComputedChecker(defCpt, item.expCpt)(expect, inst);
                        });
                    }
                });
            });

            // define Event test
            describe('Unit Test for Event', function () {
                var caseName = "shoule be ok for instance event on ";
                u._$forEach(evtCases, function (item) {
                    if (item.targetEvt) {
                        it(caseName + item.targetEvt, function (done) {
                            var inst = new Component({
                                data: item.data
                            });
                            inst.$on(item.targetEvt, function (event) {
                                expect(event).to.eql(item.expEvt);
                                done();
                            });
                            var method = item.trigger.shift();
                            inst[method].apply(inst, item.trigger);
                        });
                    }
                });
            });
        });
    });
