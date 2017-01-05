define(function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var Viewport = require("./viewport");
    var xml = require("text!./viewport.xml");
    var _ = require("_");
    var command = require("core/command");
    var factory = require("core/factory");
    var hierarchy = require("modules/hierarchy/index");
    var component = require("modules/component/index");

    var viewport = new Module({
        name: "viewport",
        xml: xml,

        viewportWidth: ko.observable(1440),
        viewportHeight: ko.observable(600),

        viewportScale: ko.observable(1.0)
    });

    // Control points of each direction
    var resizeControls = {
        // Top left
        $tl: $('<div class="resize-control tl"></div>'),
        // Top center
        $tc: $('<div class="resize-control tc"></div>'),
        // Top right
        $tr: $('<div class="resize-control tr"></div>'),
        // Left center
        $lc: $('<div class="resize-control lc"></div>'),
        // Right center
        $rc: $('<div class="resize-control rc"></div>'),
        // Bottom left
        $bl: $('<div class="resize-control bl"></div>'),
        // Bottom center
        $bc: $('<div class="resize-control bc"></div>'),
        // Bottom right
        $br: $('<div class="resize-control br"></div>')
    };

    var $outline = $('<div class="element-select-outline"></div>');
    $outline.append(resizeControls.$tl);
    $outline.append(resizeControls.$tc);
    $outline.append(resizeControls.$tr);
    $outline.append(resizeControls.$lc);
    $outline.append(resizeControls.$rc);
    $outline.append(resizeControls.$bl);
    $outline.append(resizeControls.$bc);
    $outline.append(resizeControls.$br);

    var _viewport;

    viewport.on("start", function() {
        _viewport = viewport.mainComponent.$el.find("#ViewportMain").qpf("get")[0];
        //控制选中某个元素
        viewport.$el.delegate('.cmp-element', "click", selectElement);

        initDragUpload();
    });

    function selectElement(e) {
        var eid = $(this).attr("data-cmp-eid");
        if (eid) {
            hierarchy.selectElementsByEID([eid]);
        }
    }
    viewport.getViewPort = function() {
        return _viewport;
    }

    hierarchy.on("create", function(element) {
        _viewport.addElement(element);
    });

    hierarchy.on("remove", function(element) {
        _viewport.removeElement(element)
    });

    hierarchy.on("select", function(elements) {
        var lastElement = elements[elements.length - 1];
        if (!lastElement) {
            return;
        }
        lastElement.$wrapper.append($outline);

        draggable.clear();
        _.each(elements, function(element) {
            draggable.add(element.$wrapper);
        });

        selectedElements = elements;
    });

    hierarchy.on("focus", function(element) {

        $('#Viewport').animate({
            scrollTop: element.$wrapper.position().top - 50 + 'px',
            scrollLeft: element.$wrapper.position().left - 50 + 'px'
        }, 'fast')
    });


    var selectedElements = [];

    var draggable = new qpf.helper.Draggable();
    // Update the position property manually
    draggable.on("drag", function() {
        _.each(selectedElements, function(element) {
            element.syncPositionManually();
        })
    })

    // Drag upload
    var imageReader = new FileReader();

    function initDragUpload() {
        viewport.mainComponent.$el[0].addEventListener("dragover", function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        viewport.mainComponent.$el[0].addEventListener("drop", function(e) {
            e.stopPropagation();
            e.preventDefault();

            var file = e.dataTransfer.files[0];
            if (file && file.type.match(/image/)) {

                imageReader.onload = function(e) {
                    imageReader.onload = null;
                    command.execute("create", "image", {
                        src: e.target.result
                    })
                }
                imageReader.readAsDataURL(file);
            }
        });
    }

    return viewport;
})
