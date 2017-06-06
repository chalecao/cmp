define(function () {
    var service = require("core/service");
    var testCaseApi = require("text!template/test/caseApi.js");
    var testCaseEvt = require("text!template/test/caseEvt.js");
    var testCaseIns = require("text!template/test/caseIns.js");
    var testHtml = require("text!template/test/test.html");

    var testJs = require("text!template/test/test.js");
    var testInsSpec = require("text!template/test/testInsCase.spec.js");
    var testUiSpec = require("text!template/test/testInsUICase.spec.js");
    var exportFile = {

        exportTests: function (_comName, pool, _cb) {
            var _test = {
                "caseApi_js": testCaseApi,
                "caseEvt_js": testCaseEvt,
                "caseIns_js": testCaseIns,
                "test_html": testHtml.replace(/\_\_libDir\_\_/g, pool.libPath),
                "test_js": testJs,
                "testInsCase_spec_js": testInsSpec.replace(/\_\_componentName\_\_/g, _comName),
                "testInsUICase_spec_js": testUiSpec.replace(/\_\_componentName\_\_/g, _comName),
            };
            _cb(testCaseApi, testCaseEvt, testCaseIns);

            // _selectC.meta.testInsSpec = _test["testInsCase_spec_js"];
            // _selectC.meta.testUiSpec = _test["testInsUICase_spec_js"];
            for (var key in _test) {
                service.saveApi("/api/" + _comName, {
                    ext: '{"name":"' + _comName + '", "url":"' + (pool.ruiPath + "test/" + key.replace(/\_/g, ".")) + '"}',
                    cmpData: _test[key]
                }, key + "保存成功");
            }
        }
    };

    return exportFile;
})
