//解决IE8之类不支持getElementsByClassName
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}
//获取元素计算后展示的style
function getStyle(obj, attr) {
    return getComputedStyle(obj) ? getComputedStyle(obj)[attr] : obj.currentStyle[attr];
}
//获取元素计算后展示的高度
function getHeight(item) {
    if (getStyle(item, "height") == "auto") {
        item.parentElement.style.height = "auto";
        return parseInt(getStyle(item.parentElement, "height"));
    } else {
        return parseInt(getStyle(item, "height"));
    }
}
var _tempLineH = 0;
var _tempHeight = 0;
for (var j = 2; j < 5; j++) {
    var _cateNavBoxList = document.getElementsByClassName(('f-' + j + 'lines'), document.body);
    if (!_cateNavBoxList.length) continue;
    for (var i = 0; i < _cateNavBoxList.length; i++) {
        var item = _cateNavBoxList[i];
        _tempLineH = parseInt(getStyle(item, "lineHeight"));
        _tempHeight = getHeight(item);
        if (_tempHeight > j * _tempLineH) {
            var leng = item.innerText.length * j * _tempLineH / _tempHeight - 1;
            var _tempText = item.innerText;
            item.innerText = _tempText.substr(0, leng);
            _tempHeight = getHeight(item);
            var k=0;
            while (_tempHeight <= j * _tempLineH) {
                k++;
                item.innerText = _tempText.substr(0, leng + k);
                _tempHeight = getHeight(item);
            }
            item.innerText = _tempText.substr(0, item.innerText.length - 3)+"...";
        }
    }
}
