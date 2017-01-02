define(function(require) {

    var Element = require("./element");
    var koMapping = require("ko.mapping");
    var _ = require("_");
    var $ = require("$");

    var factory = {};

    var repository = {};

    var componentFactory = {

        register: function(name, config) {
            factory[name] = config;
        },

        create: function(name, properties) {

            var el = new Element();
            repository[el.eid] = el;

            var config = factory[name];

            el.initialize(config);

            if (properties) {
                koMapping.fromJS(properties, {}, el.properties);
                delete el.properties['__ko_mapping__'];
            }
            return el;
        },

        clone: function(element) {
            var type = element.type.toLowerCase();

            var properties = koMapping.toJS(element.properties);

            var origID = element.__original__ ? element.__original__.properties.id() : element.properties.id();
            properties.id = getClonedID(origID);

            properties.left += 10;
            properties.top += 10;

            var res = componentFactory.create(type, properties);
            // Save the original element of clone;
            res.__original__ = element.__original__ || element;
            return res;
        },

        getByEID: function(eid) {
            return repository[eid];
        },

        removeByEID: function(eid) {
            delete repository[eid];
        },

        remove: function(element) {
            delete repository[element.eid];
        }
    }

    var getClonedID = (function() {
        var clonedCount = {};

        return function(id) {
            if (!clonedCount[id]) {
                clonedCount[id] = 0;
            }
            var name = id + "_复制";
            if (clonedCount[id]) {
                name += clonedCount[id];
            }
            clonedCount[id]++;
            return name;
        }
    })()

    return componentFactory;
})