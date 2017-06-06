define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var _ = require("_");

    var Panel = qpf.use("container/panel");

    var CodeItemView = require("./property");
    var _editorArray = [];
    var _execCmdArray = [];
    var _execCmdArrayIndex = 0;

    var xml = require("text!./property.xml");
    var Modal = require("modules/common/modal");

    function e_preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    function e_stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }

    function e_defaultPrevented(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false
    }

    function e_stop(e) {
        e_preventDefault(e);
        e_stopPropagation(e);
    }

    var shellCmd = new Module({
        name: "property",
        xml: xml,
        CodeItemView: CodeItemView,
        codeArray: ko.observableArray([]),
        getCmd: function (func, cwd, _cb, _load) {
            var args = encodeURI('func=' + func + "&cwd=" + cwd);
            $.get("http://localhost:" + (+location.port + 1) + "/run?" + args, {}, function (_data) {
                _cb(_data);
            });
            _load();
        },
        root: "./",
        addCode: function (force, _root) {
            if (_editorArray.length > 0 && !force) {
                $('#cmd').slideDown();
                return;
            }
            var _that = this;
            if (_root) {
                _that.root = _root;
            }
            var _codeA = _that.codeArray()
            var titleStr = "CMPS-" + _codeA.length;
            var classStr = "CMPS-" + _codeA.length;
            var codeStr = _that.root + " $ ";
            _codeA.push({
                titleStr: titleStr,
                classStr: classStr,
                codeStr: codeStr,
                index: _that.codeArray().length
            });
            _that.codeArray(_codeA);
            var _cm = CodeMirror.fromTextArea(
                $('#cmd .' + classStr)[0], {
                    lineNumbers: true,
                    mode: 'javascript',
                    lineWrapping: true,
                    autofocus: true,
                    tabSize: 4
                }
            );
            _cm.doc.setCursor(_cm.doc.lastLine() + 1);

            function setLastLine(_cmm) {
                _cmm.doc.setCursor(_cmm.doc.lastLine() + 1);
            }

            _cm.on("keydown", function (_cmm, _keyEvent) {
                if (!_keyEvent.ctrlKey && _cmm.doc.getCursor().line != _cmm.doc.lastLine()) {
                    e_stop(_keyEvent);
                    return false;
                }
                if (_keyEvent.keyCode == 38) {
                    //up fobidden
                    e_stop(_keyEvent);
                    //找到上一条命令
                    if (_execCmdArrayIndex > 0) {
                        _execCmdArrayIndex--;
                        var _lastCmd = _execCmdArray[_execCmdArrayIndex];
                        _cmm.doc.setValue(_cmm.doc.getValue() + "\n" + _lastCmd);
                        setLastLine(_cmm);
                    }
                    return false;
                } else if (_keyEvent.keyCode == 40) {
                    //down fobidden
                    e_stop(_keyEvent);
                    //找到上一条命令
                    if (_execCmdArrayIndex < _execCmdArray.length - 1) {
                        _execCmdArrayIndex++;
                        var _lastCmd = _execCmdArray[_execCmdArrayIndex];
                        _cmm.doc.setValue(_cmm.doc.getValue() + "\n" + _lastCmd);
                        setLastLine(_cmm);
                    }
                    return false;
                } else if (_keyEvent.keyCode == 8 || _keyEvent.keyCode == 37) {
                    //backspace del = 8, left  = 37
                    var _val = _cmm.doc.getValue();
                    if (_val[_val.length - 2] == "$" || _val[_val.length - 1] == "$") {
                        e_stop(_keyEvent);
                        return false;
                    }
                }
            });


            _cm.on("keyup", function (_cmm, _keyEvent) {
                if (_keyEvent.keyCode == 13) {
                    // enter
                    var line = _cmm.doc.getLine(_cmm.lastLine() - 1);
                    var _cmd = $.trim(line.substr(line.indexOf("$") + 1));
                    var _pwd = line.substring(0, line.indexOf("$") - 1);
                    if (_cmd.split(" ")[0] == "cd") {
                        var _param = _cmd.split(" ")[1];
                        if (_param.indexOf(":") > 0) {
                            _pwd = _param;
                        } else if (_param == "..") {
                            _pwd += "/../";
                        } else if (_param != ".") {
                            if (_pwd[_pwd.length - 1] != "/")
                                _pwd += "/" + _param;
                            else
                                _pwd += _param;
                        }
                        //设置默认
                        _cmm.doc.setValue(_cmm.doc.getValue() + "\n" + _pwd + " $ ");
                        setLastLine(_cmm);

                    } else if (_cmd.indexOf("clear") >= 0) {
                        //清空
                        _cmm.doc.setValue(_pwd + " $ ");
                        setLastLine(_cmm);
                    } else if (_cmd && _pwd) {
                        //记住历史命令
                        _execCmdArray.push(line);
                        _execCmdArrayIndex = _execCmdArray.length;
                        //处理请求
                        _that.getCmd(_cmd, _pwd, function (_data) {
                            //获取数据处理
                            if (window.loadingCmd) {
                                window.loadingCmd = clearInterval(window.loadingCmd);
                            }
                            if (_cmd == "ls") _data = _data.replace(/\n/g, "     ");
                            _cmm.doc.setValue(_cmm.doc.getValue() + "\n" + _data + "\n" + _pwd + " $ ");
                            setLastLine(_cmm);
                        }, function () {
                            //loading  回调
                            window.loadingCmd = setInterval(function () {
                                _cmm.doc.setValue(_cmm.doc.getValue() + ".");
                                setLastLine(_cmm);
                            }, 200);
                            setTimeout(function () {
                                if (window.loadingCmd) {
                                    window.loadingCmd = clearInterval(window.loadingCmd);
                                    _cmm.doc.setValue(_cmm.doc.getValue() + " timeout 120s" + "\n" + _pwd + " $ ");
                                    setLastLine(_cmm);
                                }
                            }, 120000);
                        });
                    } else {
                        _cmm.doc.setValue(_cmm.doc.getValue() + "\n" + _pwd + " $ ");
                        setLastLine(_cmm);
                    }
                }

            });
            _cm.setOption('theme', 'monokai');
            setTimeout(function () {
                _cm.refresh();
            }, 100);
            _editorArray.push(_cm);
            var _tabEl = $("#cmd .qpf-tab-header>.qpf-tab-tabs>li");
            setTimeout(function () {
                $(_tabEl[_tabEl.length - 1]).trigger("click");
            }, 300);
            //展示编辑器
            $('#cmd').slideDown();
            //隐藏switchDesign
            $('.switchDesign').hide();
            $('#cmd .editor-new').click(function () {
                _that.addCode(true);
            });
            $('#cmd .editor-close').click(function () {
                var index = $(this).attr("index");
                if (_that.codeArray().length >= 0) {
                    var _arr = _that.codeArray();
                    _arr.splice(+index, 1);
                    _that.codeArray(_arr);
                    _editorArray.splice(+index, 1);
                    var _tabEl = $("#cmd .qpf-tab-header>.qpf-tab-tabs>li");
                    setTimeout(function () {
                        $(_tabEl[_tabEl.length - 1]).trigger("click");
                    }, 300);
                }
                if (_that.codeArray().length == 0) {
                    $('#cmd').slideUp();
                    //隐藏switchDesign
                    $('.switchDesign').show();
                }
            });
            $('#cmd .editor-cancel').click(function () {
                $('#cmd').slideUp();
                //隐藏switchDesign
                $('.switchDesign').show();

            });
        }
    });

    return shellCmd;
});
