/**
 * Test component instance case and UI case.UIAct & UITrigger & UIResult used in UI Test。
 * staticInsApi: if the component has static api to generate it's instance, this is the static api name.
 * UIAct: UI test description. 
 * UITrigger: UITrigger for animate UI operation, UITrigger[0] for element selector, UITrigger[1] for event name. 
 * UIResult: UIResult to checkout the result after act. UIResult['hasClass'] is to check has specific className or not, UIResult['hasClass'] is two level array, the item is a small array which has 3 elements, item[0] is the element selector, item[1] means has or hasn't, 1 for has, 0 for hasn't. item[2] is the className. UIResult['hasStyle'] is the same, but the item[2] has the style name and the corresponding style value. 
 ** example:
 * {
 *     "staticInsApi": "static api name, if not ,leave it blank",
 *     "data": {
 *     },
 *     "UIAct":"has pager or click close icon",
 *     "UITrigger": [".u-st-cert", "click"],
 *     "UIResult": { 
 *          "hasClass": [[".u-st-cert", 1, "f-dn"],[".u-st-cert", 1, "f-dn"]],
 *          "hasStyle": [[".u-st-cert", 0, "color:red"],[".u-st-cert", 1, "color:red"]],
 *      },
 *     "expPro": {
 *         "title": "",
 *         "content": ""
 *     },
 *     "expCpt": {
 *         "title": ""
 *     }
 * }
 *
 */
NEJ.define([], function () {
    return [];
});
