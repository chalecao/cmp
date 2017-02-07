/** 滚动到显示的时候 触发动画 **/
function scrollShow() {
    var x = document.getElementsByClassName("animated");
    for (i = 0; i < x.length; i++) {
        var item = x[i];
        var _cls = item.className;
        if (_cls.indexOf("aniover") >= 0) {
            return;
        }
        var top = item.getBoundingClientRect().top;
        var se = document.documentElement.clientHeight;

        if (top <= se) {
            var _ani = _cls.substring(_cls.indexOf("animated") + 1);
            _ani = "animated " + _ani.substring(_cls.indexOf(" "));
            item.className = _cls.substring(0, _cls.indexOf("animated"));
            setTimeout(function () {
                item.className = item.className + " " + _ani + " aniover";
            }, 50);

        }
    }
}
scrollShow();
if (window.attachEvent) {
    window.attachEvent("scroll", scrollShow);
} else {
    window.addEventListener("scroll", scrollShow);
}
