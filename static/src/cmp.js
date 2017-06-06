define(function(require){
    
    var cmp =  {
	"App": require('app'),
	"ControllerConfig": require('controllerConfig'),
	"core": {
		"Command": require('core/command'),
		"Element": require('core/element'),
		"Factory": require('core/factory'),
		"Service": require('core/service')
	},
	"elements": {
		"Func": require('elements/func'),
		"Image": require('elements/image'),
		"Select": require('elements/select'),
		"Timeline": require('elements/timeline'),
		"Umi": require('elements/umi')
	},
	"modules": {
		"codeEditor": {
			"Index": require('modules/codeEditor/index'),
			"Property": require('modules/codeEditor/property')
		},
		"common": {
			"Buttongroup": require('modules/common/buttongroup'),
			"CodeArea": require('modules/common/codeArea'),
			"Color": require('modules/common/color'),
			"Contextmenu": require('modules/common/contextmenu'),
			"Gradient": require('modules/common/gradient'),
			"Histogram": require('modules/common/histogram'),
			"Iconbutton": require('modules/common/iconbutton'),
			"List": require('modules/common/list'),
			"Listitem": require('modules/common/listitem'),
			"ListTab": require('modules/common/listTab'),
			"Modal": require('modules/common/modal'),
			"Nativehtml": require('modules/common/nativehtml'),
			"Palette": require('modules/common/palette'),
			"Region": require('modules/common/region'),
			"TextArea": require('modules/common/textArea'),
			"Togglebutton": require('modules/common/togglebutton'),
			"Toggleiconbutton": require('modules/common/toggleiconbutton')
		},
		"component": {
			"Component": require('modules/component/component'),
			"Index": require('modules/component/index')
		},
		"dataMock": {
			"Index": require('modules/dataMock/index'),
			"Property": require('modules/dataMock/property')
		},
		"hierarchy": {
			"Element": require('modules/hierarchy/element'),
			"Index": require('modules/hierarchy/index')
		},
		"Module": require('modules/module'),
		"page": {
			"Element": require('modules/page/element'),
			"Index": require('modules/page/index')
		},
		"pool": {
			"Element": require('modules/pool/element'),
			"Index": require('modules/pool/index')
		},
		"property": {
			"Index": require('modules/property/index'),
			"Property": require('modules/property/property')
		},
		"Router": require('modules/router'),
		"shellCmd": {
			"Index": require('modules/shellCmd/index'),
			"Property": require('modules/shellCmd/property')
		},
		"toolbar": {
			"Index": require('modules/toolbar/index'),
			"Toolbargroup": require('modules/toolbar/toolbargroup')
		},
		"viewport": {
			"Index": require('modules/viewport/index'),
			"Viewport": require('modules/viewport/viewport')
		}
	},
	"project": {
		"Project": require('project/project')
	},
	"util": {
		"ExportFile": require('util/exportFile'),
		"RegKey": require('util/regKey')
	}
};

    return cmp;
})
