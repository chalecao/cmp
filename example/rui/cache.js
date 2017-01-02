/**
 * ----------------------------------------------------------
 * CdiscussBox接口
 * 
 * @module   CdiscussBox
 * ----------------------------------------------------------
 */
define([
    'pro/common/cache',
    'pro/common/cache/cache',
    'base/util'
], function(_cache, _dwr, _util, _p) {
    /**
     * getEssentialPostVo
     * @param  {Object} _data
     */
    _p._$getEssentialPostVo = function (_data, _onLoad) {
        _cache._$request({
            url: '/web/j/MocPostRpcBean.getEssentialPostVo.rpc',
            method: 'post',
            data: _data,
            onload: _onLoad
        });
    };

});
