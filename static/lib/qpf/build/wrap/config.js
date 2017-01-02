var _define = define;
// Here if we directly use define, the app build on it will have some problem when running the optimized version
// I guess the optimizer will use regexp to detemine if the depedencies is defined in the file already
// And it find jQuery, knokcout, underscore is defined in the qpf, even if it is in closure
// and won't affect the outer environment. And optimizer won't add the dependencies file in the final optimized js file.
_define("$", [], function(){
    return $;
});
_define("knockout", [], function(){
    return ko;
});
_define("_", [], function(){
    return _;
});
