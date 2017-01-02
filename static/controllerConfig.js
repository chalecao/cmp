// controller defines how and when the modules are loaded
// todo : add priority??
define({
    //---------region: main navigator-------------
    "navigator" : {
        "modules/navigator/index" : {
            "url" : "*"
        }
    },
    "viewport" : {
        "modules/viewport/index" : {
            "url" : "*"
        }
    },
    "property" : {
        "modules/property/index" : {
            "url" : "*"
        }
    },
    "toolbar" : {
        "modules/toolbar/index" : {
            "url" : "*"
        }
    },
    "hierarchy" : {
        "modules/hierarchy/index" : {
            "url" : "*"
        }
    },
    "component" : {
        "modules/component/index" : {
            "url" : "*"
        }
    },
    "page" : {
        "modules/page/index" : {
            "url" : "*"
        }
    }
})
