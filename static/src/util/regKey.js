define(function () {

    var keyManager = {

        registerKey: function (ctrl, alt, shift, key, _cb) {
            $(document.body).keydown(function (_ke) {
                if (_ke.ctrlKey == ctrl && _ke.altKey == alt && _ke.shiftKey == shift && _ke.key == key) {
                    _cb();
                }
            })

        }
    };

    return keyManager;
})
