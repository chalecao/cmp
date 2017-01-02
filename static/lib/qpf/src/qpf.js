define(function(require){
    
    var qpf =  {
	"Base": require('base'),
	"container": {
		"Application": require('container/application'),
		"Box": require('container/box'),
		"Container": require('container/container'),
		"Hbox": require('container/hbox'),
		"Inline": require('container/inline'),
		"Panel": require('container/panel'),
		"Tab": require('container/tab'),
		"Vbox": require('container/vbox'),
		"Window": require('container/window')
	},
	"core": {
		"Clazz": require('core/clazz'),
		"mixin": {
			"Derive": require('core/mixin/derive'),
			"Event": require('core/mixin/event')
		},
		"Xmlparser": require('core/xmlparser')
	},
	"helper": {
		"Draggable": require('helper/draggable')
	},
	"meta": {
		"Button": require('meta/button'),
		"Checkbox": require('meta/checkbox'),
		"Combobox": require('meta/combobox'),
		"Image": require('meta/image'),
		"Label": require('meta/label'),
		"Meta": require('meta/meta'),
		"Overlay": require('meta/overlay'),
		"Overlaymanager": require('meta/overlaymanager'),
		"Slider": require('meta/slider'),
		"Spinner": require('meta/spinner'),
		"Textfield": require('meta/textfield'),
		"Texture": require('meta/texture'),
		"Tooltip": require('meta/tooltip'),
		"Tree": require('meta/tree'),
		"Video": require('meta/video')
	},
	"Util": require('util'),
	"widget": {
		"Color_vm": require('widget/color_vm'),
		"Palette": require('widget/palette'),
		"Vector": require('widget/vector'),
		"Widget": require('widget/widget')
	}
};

    qpf.create = qpf.Base.create;

    return qpf;
})
