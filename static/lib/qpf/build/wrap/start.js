 (function(factory){
 	// AMD
 	if( typeof define !== "undefined" && define["amd"] ){
 		define(["exports", "knockout", "$", "_"], factory);
 	// No module loader
 	}else{
 		factory( window["qpf"] = {}, ko, $, _);
 	}

})(function(_exports, ko, $, _){
