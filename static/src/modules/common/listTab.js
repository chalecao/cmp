define(function (require) {

    var qpf = require("qpf");
    var listItem = require("./listitem");
    var Container = qpf.use("container/container");
    var ko = require("knockout");

    var ListTab = Container.derive(function () {

        var ret = {
            dataSource: ko.observableArray([]),

            itemView: ko.observable(listItem), // item component constructor

            selected: ko.observableArray([]),

            multipleSelect: false,

            dragSort: false,
            actived: ko.observable(0),

            maxTabWidth: 150,

            minTabWidth: 50
        }

        ret.actived.subscribe(function (idx) {
            this._active(idx);
        }, this);

        return ret;
    }, {
        type: "LISTTAB",

        css: "list-tab qpf-ui-tab",

        template: '<div class="qpf-tab-header">\
                        <ul class="qpf-tab-tabs" data-bind="foreach:children">\
                            <li data-bind="click:$parent.actived.bind($data, $index())">\
                                <a data-bind="html:$data.titleStr">adasd</a>\
                            </li>\
                        </ul>\
                        <div class="qpf-tab-tools"></div>\
                    </div>\
                    <div class="qpf-tab-body">\
                        <div data-bind="foreach:children" >\
                            <div class="qpf-container-item">\
                                <div data-bind="qpf_view:$data"></div>\
                            </div>\
                        </div>\
                    </div>',

        eventsProvided: _.union(Container.prototype.eventsProvided, "select"),

        initialize: function () {

            var oldArray = _.clone(this.dataSource()),
                self = this;

            this.dataSource.subscribe(function (newArray) {
                this._update(oldArray, newArray);
                oldArray = _.clone(newArray);
                _.each(oldArray, function (item, idx) {
                    if (ko.utils.unwrapObservable(item.selected)) {
                        this.selected(idx)
                    }
                }, this);
            }, this);


            this._update([], oldArray);
            
        },

        _updateTabSize: function () {
            var length = this.children().length,
                tabSize = Math.floor((this.$el.width() - 20) / length);
            // clamp
            tabSize = Math.min(this.maxTabWidth, Math.max(this.minTabWidth, tabSize));

            this.$el.find(".qpf-tab-header>.qpf-tab-tabs>li").width(tabSize);

        },
        _getSelectedData: function () {
            var dataSource = this.dataSource();
            var result = _.map(this.selected(), function (idx) {
                return dataSource[idx];
            }, this);
            return result;
        },

        _update: function (oldArray, newArray) {

            var children = this.children();
            var ItemView = this.itemView();
            var result = [];

            var differences = ko.utils.compareArrays(oldArray, newArray);
            var newChildren = [];
            _.each(differences, function (item) {
                if (item.status === "retained") {
                    var index = oldArray.indexOf(item.value);
                    result[index] = children[index];
                } else if (item.status === "added") {
                    var newChild = new ItemView({
                        attributes: item.value
                    });
                    result[item.index] = newChild;
                    children.splice(item.index, 0, newChild);
                    newChildren.push(newChild);
                }
            }, this)
            this.children(result);
            // render after it is appended in the dom
            // so the component like range will be resized proply
            _.each(newChildren, function (c) {
                c.render();
            })
            this._updateTabSize();

        },

        _unSelectAll: function () {
            _.each(this.children(), function (child, idx) {
                if (child) {
                    child.$el.removeClass("selected")
                }
            }, this)
        },
        _unActiveAll: function () {
            _.each(this.children(), function (child) {
                child.$el.css("display", "none");
            });
        },
        _active: function (idx) {
            this._unActiveAll();
            var current = this.children()[idx];
            if (current) {
                current.$el.css("display", "block");

                // Trigger the resize events manually
                // Because the width and height is zero when the panel is hidden,
                // so the children may not be properly layouted, We need to force the
                // children do layout again when panel is visible;

                // this.trigger('change', idx, current);
            }

            this.$el.find(".qpf-tab-header>.qpf-tab-tabs>li")
                .removeClass("actived")
                .eq(idx).addClass("actived");
        }

    })
    //注意这个绑定的元素listtab 不能为驼峰，因为html规范标签必须为小写形式
    Container.provideBinding("listtab", ListTab);

    return ListTab;
})
