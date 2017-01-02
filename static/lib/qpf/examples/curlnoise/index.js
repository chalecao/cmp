define(function(require){
	
	var qpf = require("qpf");
	var XMLParser = qpf.use("core/xmlparser");
	var shaders =  require("./shaders");
	var ko = qpf.use("knockout");
	
	var viewportWidth = window.innerWidth;
	var viewportHeight = window.innerHeight;

	//----------------------------------------
	// create viewmodels
	var viewModel = {
		particleNumber : ko.observable(256),

		_isPlay : ko.observable(true),
		// events
		togglePlay : function(){
			viewModel._isPlay( ! viewModel._isPlay() );
		},

		// noisePP parameters
		turbulence : {
			x : ko.observable(0.100),
			y : ko.observable(0.12)
		},

		persistence : ko.observable(0.707),

		// particle instances
		particles : ko.observableArray(),

		newSpawn : newSpawn
	};

	viewModel.status = ko.computed({
		read : function(){
			return this._isPlay() ? "Pause" : "Play";
		},
		write : function(newValue){
		}
	}, viewModel);

	$.get("main.xml", function(xmlString){
		var dom = XMLParser.parse(xmlString);
		document.body.appendChild(dom);
		ko.applyBindings(viewModel, dom);
	}, "text");

	//-------------------------------------
	// create scene
	var renderer = new THREE.WebGLRenderer({
		canvas : document.getElementById('Viewport')
	});
	renderer.setSize(window.innerWidth, window.innerHeight);

	//main scene
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 2000);
	camera.position.z = 0.6;

	CurlNoise.setShaderStrings( shaders );


	var turbulence = createBindableVector2(viewModel.turbulence);
	var spawns = [];

	function makeParticleViewModel() {
		return {
			spawnSize : ko.observable(0.2)
		}
	}
	function newSpawn(){

		var particleViewModel = makeParticleViewModel();

		var spawn = CurlNoise.spawn({
			size : viewModel.particleNumber(),
			position : new THREE.Vector3(Math.random()*3-3, Math.random()*3-3, 0),
		});
		spawn.noisePP.updateParameter("turbulence", turbulence);
		bindingParameter(spawn.noisePP, "persistence", viewModel.persistence);
		bindingParameter(spawn.spawnPP, "spawnSize", particleViewModel.spawnSize);

		spawns.push(spawn);
		scene.add(spawn.particleSystem);
	}

	newSpawn();

	function run(){

		var startTime = Date.now();

		function step(timestamp){

			requestAnimationFrame(step);

			var now = Date.now();
			var delta = now - startTime;
			startTime = now;

			if(viewModel._isPlay()){
				spawns.forEach(function(spawn){
					spawn.update(renderer, delta);
				})
				// renderer.render(scene, camera);
			}
		}

		step();
	}

	function createBindableVector2(source){
		var vec2 = new THREE.Vector2(source.x(), source.y());
		ko.computed(function(){
			vec2.x = source.x();
			vec2.y = source.y();
		});
		return vec2;
	}
	function createBindableVector3(source){
		var vec3 = new THREE.Vector2(source.x(), source.y(), source.z());
		ko.computed(function(){
			vec3.x = source.x();
			vec3.y = source.y();
			vec3.z = source.z();
		});
		return vec3;
	}
	function bindingParameter(pp, key, source){
		ko.computed(function(){
			pp.updateParameter(key, source());
		})
	}

	run();
})