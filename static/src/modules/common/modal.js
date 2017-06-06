define(function (require) {

    var qpf = require("qpf");
    var Clazz = qpf.use("core/clazz");
    var Window = qpf.use("container/window");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Button = qpf.use("meta/button");
    var Label = qpf.use("meta/label");
    var ko = require("knockout");
    var modalCnt = 0;

    function generateModalWin() {
        var wind = new Window({
            attributes: {
                class: "qpf-modal"
            }
        });
        wind.body = new Container(),
            wind.buttons = new Inline(),
            wind.applyButton = new Button({
                attributes: {
                    text: "确 定"
                }
            }),
            wind.cancelButton = new Button({
                attributes: {
                    text: "取 消"
                }
            });
        wind.add(wind.body);
        wind.add(wind.buttons);
        wind.buttons.add(wind.applyButton);
        wind.buttons.add(wind.cancelButton);

        wind.render();
        document.body.appendChild(wind.$el[0]);
        wind.$mask = $('<div class="qpf-mask"></div>');
        document.body.appendChild(wind.$mask[0]);

        wind.$el.hide();
        wind.$mask.hide();
        modalCnt++;
        return wind;
    }
    var wind = generateModalWin();
    var Modal = Clazz.derive(function () {
        return {
            title: "",
            body: null,
            onApply: function (next) {
                next()
            },
            onCancel: function (next) {
                next()
            }
        }
    }, {
        show: function (single) {
            var self = this;
            if (!single) {
                self.wind = generateModalWin();
                wind = self.wind;
            }

            wind.title(this.title);

            wind.body.removeAll();
            this.body &&
                wind.body.add(this.body);

            wind.applyButton.off("click");
            wind.cancelButton.off("click");
            wind.applyButton.on("click", function () {
                self.onApply(self.hide)
            });
            wind.cancelButton.on("click", function () {
                self.onCancel(self.hide);
            });

            wind.$el.show();
            wind.$mask.show();

            wind.left(($(window).width() - wind.$el.width()) / 2)
            wind.top(($(window).height() - wind.$el.height()) / 2 - 100)
        },
        hide: function () {
            var self = this;
            if (self.wind) {
                self.wind.$el.remove();
                self.wind.$mask.remove();
            } else {
                wind.$el.remove();
                wind.$mask.remove();
            }
            modalCnt--;
            if (modalCnt < 1) {
                modalCnt = 1;
            }
        }
    })

    Modal.popup = function (title, body, onApply, onCancel, timer) {
        var modal = new Modal({
            title: title,
            body: body,
            onApply: function (next) {
                onApply && onApply();
                next.call(modal)
            },
            onCancel: function (next) {
                onCancel && onCancel();
                next.call(modal)
            }
        });
        modal.body.render();
        modal.show();
        if (timer) {
            if (modalCnt > 6) modalCnt = 1;
            modal.wind.$el.css("margin-top", (modalCnt - 2) * 100 -60 + "px");
            setTimeout(function () {
                modal.hide();
            }, +timer);
        }
        return modal;
    }

    Modal.confirm = function (title, text, onApply, onCancel, timer) {
        var modal = new Modal({
            title: title,
            //TODO: Implement a componennt like <p> ?
            body: new Label({
                attributes: {
                    text: text
                },
                temporary: true
            }),
            onApply: function (next) {
                onApply && onApply();
                next.call(modal)
            },
            onCancel: function (next) {
                onCancel && onCancel();
                next.call(modal)
            }
        });
        modal.body.render();
        modal.show();
        if (timer) {
            if (modalCnt > 6) modalCnt = 1;
            modal.wind.$el.css("margin-top", (modalCnt - 2) * 100 -60 + "px");
            setTimeout(function () {
                modal.hide();
            }, +timer);
        }
        return modal;
    }

    return Modal;
})
