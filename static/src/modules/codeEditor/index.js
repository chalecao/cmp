define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var _ = require("_");

    var Panel = qpf.use("container/panel");
    var componentModule = require("modules/component/index");

    var CodeItemView = require("./property");
    var _editorArray = [];

    var xml = require("text!./property.xml");
    var Modal = require("modules/common/modal");

    var dummy = {
        attrs: {
            color: ["red", "green", "blue", "purple", "white", "black", "yellow"],
            size: ["large", "medium", "small"],
            description: null
        },
        children: []
    };

    var tags = {
        "!top": ["top"],
        "!attrs": {
            id: null,
            class: ["A", "B", "C"]
        },
        top: {
            attrs: {
                lang: ["en", "de", "fr", "nl"],
                freeform: null
            },
            children: ["animal", "plant"]
        },
        animal: {
            attrs: {
                name: null,
                isduck: ["yes", "no"]
            },
            children: ["wings", "feet", "body", "head", "tail"]
        },
        plant: {
            attrs: {
                name: null
            },
            children: ["leaves", "stem", "flowers"]
        },
        wings: dummy,
        feet: dummy,
        body: dummy,
        head: dummy,
        tail: dummy,
        leaves: dummy,
        stem: dummy,
        flowers: dummy
    };

    function completeAfter(cm, pred) {
        var cur = cm.getCursor();
        if (!pred || pred()) setTimeout(function () {
            if (!cm.state.completionActive)
                cm.showHint({
                    completeSingle: false
                });
        }, 100);
        return CodeMirror.Pass;
    }

    function completeIfAfterLt(cm) {
        return completeAfter(cm, function () {
            var cur = cm.getCursor();
            return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
        });
    }

    function completeIfInTag(cm) {
        return completeAfter(cm, function () {
            var tok = cm.getTokenAt(cm.getCursor());
            if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
            var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
            return inner.tagName;
        });
    }

    var codeEditor = new Module({
        name: "property",
        xml: xml,
        CodeItemView: CodeItemView,
        codeArray: ko.observableArray([]),

        showCode: function (_codeArray, _cb) {
            if (_codeArray.length < 1) {
                Modal.confirm("提示", "没有代码哦！", null, null, 1000);
                return;
            }
            // codeEditor.doc.getValue();
            // codeEditor.doc.setValue("");
            var _that = this;
            _editorArray = [];
            _that.codeArray([]);

            _.each(_codeArray, function (item) {
                _that.codeArray.push({
                    titleStr: item.titleStr,
                    classStr: item.classStr,
                    codeStr: item.codeStr
                });
                var _cm = CodeMirror.fromTextArea(
                    $('#editor .' + item.classStr)[0], {
                        lineNumbers: true,
                        styleActiveLine: true,
                        autoCloseBrackets: true,
                        autoCloseTags: true,
                        highlightSelectionMatches: {
                            showToken: /\w/,
                            annotateScrollbar: true
                        },
                        matchTags: {
                            bothTags: true
                        },
                        mode: /^.*(FTL)|(HTML).*$/.test(item.classStr) ? 'htmlmixed' : 'javascript',
                        tabSize: 4,
                        indentUnit: 4,
                        keyMap: "sublime",
                        gutters: ["CodeMirror-lint-markers"],
                        lint: true,
                        autofocus: true
                    }
                );
                _cm.setOption('theme', 'monokai');
                setTimeout(function () {
                    _cm.refresh();
                }, 100);
                _editorArray.push(_cm);
            });
            var _tabEl = $("#editor .qpf-tab-header>.qpf-tab-tabs>li");
            setTimeout(function () {
                $(_tabEl[_tabEl.length - 1]).trigger("click");
                $(_tabEl[0]).trigger("click");
            }, 300);
            //展示编辑器
            $('#editor').slideDown();
            //隐藏switchDesign
            $('.switchDesign').hide();
            var _that = this;
            $('#editor .editor-close').click(function () {
                if ($('#editor').is(":visible")) {

                    $('#editor').hide();
                    var _code = _that.codeArray();
                    _.each(_editorArray, function (editor, index) {
                        _code[index].codeStr = editor.doc.getValue();
                    })
                    _cb(_code);
                }
            });
            $('#editor .editor-cancel').click(function () {
                if ($('#editor').is(":visible")) {
                    $("#editor").slideUp();
                    // window.componentCodeEditor && componentCodeEditor.doc.setValue("");
                    // window.cacheCodeEditor && cacheCodeEditor.doc.setValue("");
                }
            });
        },
    });

    return codeEditor;
});
