/**
 * service 抽出来主要用于发送请求，保存数据
 */
define(function (require) {
    var $ = require("$");
    var Modal = require("modules/common/modal");
    var service = {
        /**
         *  保存数据
         *  @param _url请求地址
         *         _data 请求参数
         *         _ok 回到函数，如果是字符串，则展示提示信息
         */
        saveApi: function (_url, _data, _ok) {
            $.post(_url,_data, function (_d) {
                if (typeof _ok == "function") {
                    _ok(_d);
                } else {
                    Modal.confirm("提示", _d.message || _ok, null, null, 3000);
                }
            });
        }

    }

    return service;
})
