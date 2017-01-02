define(["knockout",
		"../src/qpf"], function(ko){

	var XMLParser = require("core/xmlparser");

	var viewModel = {
		title : ko.observable("window"),
		clickHandler : function(){
			viewModel.info("button is clicked");
		},
		vector : {
			x : ko.observable(10),
			y : ko.observable(10)
		},
		info : ko.observable("Im a label~"),

		visible : ko.observable(true),

		drawCanvas : drawCanvas
	}

	$.get('./component.xml', function(result){

		var dom = XMLParser.parse(result);
		console.log(dom);
		document.body.appendChild(dom);

		ko.applyBindings(viewModel, dom);
		
	}, 'text')


	function drawCanvas(){
		var stage = this.stage;

		var line = new GooJS.Line({
			start : [0, 0],
			end : [1000, 1000]
		})
		stage.add(line);
	}
})