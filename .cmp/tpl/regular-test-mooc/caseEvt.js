/**
 * Test component event, 
 * trigger: trigger param, trigger[0] is the event name, trigger[1] is the param;
 * * example:
 * {
 *     "targetEvt": "destroy",
 *     "data": {
 *         "index": 14,
 *         "total": 15
 *     },
 *     "trigger": ["go", 1],
 *     "expEvt": {
 *         "last": 14,
 *         "index": 1,
 *         "total": 15
 *     }
 * }
 */
NEJ.define([], function () {
    return [{
        "targetEvt": "destroy",
        "data": {},
        "trigger": ["destroy"],
        "expEvt": undefined
    }];
});
