var CurlNoise = (function(){

	var pars = {
		minFilter : THREE.NearestFilter,
		magFilter : THREE.NearestFilter,
		type : THREE.FloatType,
		format : THREE.RGBAFormat
	}


	function CurlNoise(options){

		var options = options || {};
		this.color = options.color || new THREE.Color(0x000000);

		this.spawnPP = new PostProcessing({
			fragmentShader : shaderStrings['spawnPPFragShader'],
			outputPin : null,
			parameters : {
				'spawnPosition' : {type : 'v3', value : (options.position || new THREE.Vector3(0, 0, 0))},
				'spawnSize' : {type:'f', value:0.02},
				'elapsedTime' : {type : 'f', value : 0}
			}
		})

		this.noisePP = new PostProcessing({
			fragmentShader : shaderStrings['noisePPFragShader'],
			outputPin : null,
			parameters : {
				'elapsedTime' : {type : 'f', value : 0},
				'turbulence' : {type : 'v2', value: new THREE.Vector2(0.103, 0.079)},
				'persistence' : {type : 'f', value : 0.707}
			}
		});

		this.particlePP = new PostProcessing({
			fragmentShader : shaderStrings['particlePPFragShader'],
			inputPin : {
				'spawnTexture' : null,
				'noiseTexture' : null,
				'particleTexture' : null
			},
			outputPin : null,
			parameters : {
				'deltaTime' : {value : 0, type : 'f'},
				'elapsedTime' : {type : 'f', value : 0},
				'particleTextureSize' : {value : 256, type : 'f'},
				'noiseTextureSize' : {value : 256, type : 'f'},
			}
		});

		this.createParticleSystem();
		this.updateParticleNumber( options.size || 256 );

		// renderer.clearTarget(this.particleTextureSource, true, true, true );
	}

	CurlNoise.prototype.updateParticleNumber = function( size ){

		this.spawnTexture = new THREE.WebGLRenderTarget(size, size, pars);
		this.noiseTexture = new THREE.WebGLRenderTarget(size, size, pars);
		this.particleTextureSource = new THREE.WebGLRenderTarget(size, size, pars);
		this.particleTextureTarget = new THREE.WebGLRenderTarget(size, size, pars);

		this.particlePP.updateParameter({
			"particleTextureSize" : size,
			"noiseTextureSize": size
		});

		this.spawnPP.setOutputPin(this.spawnTexture);
		this.noisePP.setOutputPin(this.noiseTexture);
		this.particlePP.setOutputPin(this.particleTextureTarget);
		this.particlePP.setInputPin({
			'spawnTexture' : this.spawnTexture,
			'noiseTexture' : this.noiseTexture,
			'particleTexture' : this.particleTextureSource
		})

		var vertices = this.particleSystem.geometry.vertices,
			attributes = this.particleSystem.material.attributes;
		vertices.length = 0;
		attributes['aUv'].value = [];

		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				vertices.push(new THREE.Vector3(0, 0, 0));
				attributes['aUv'].value.push(new THREE.Vector2(i/size, j/size));
			}
		}
	}

	CurlNoise.prototype.createParticleSystem = function(){
		var spiritTexture =new THREE.Texture(generateSprite());
		spiritTexture.needsUpdate = true;
		var uniforms = {
			'particleTexture' : {
				type : 't',
				value : null
			},
			'spiritTexture' : {
				type : 't',
				value : spiritTexture
			},
			'color' : {
				type : 'c',
				value : this.color
			}
		}
		var attributes = {
			'aUv' : {type : 'v2', value:[]}
		}
		var particles = new THREE.Geometry();

		var material = new THREE.ShaderMaterial({
			uniforms : uniforms,
			attributes : attributes,
			vertexShader : shaderStrings['particleVertexShader'],
			fragmentShader : shaderStrings['particleFragShader'],
			depthWrite : false,
			transparent : true
		})
		var particleSystem = new THREE.ParticleSystem(particles, material);

		this.particleSystem = particleSystem;
	}

	CurlNoise.prototype.update = function(renderer, deltaTime){

		if( ! this.elapsedTime ){
			this.elapsedTime = 0;
		}
		var elapsedTime = this.elapsedTime/1000.0;

		this.spawnPP.updateParameter('elapsedTime', elapsedTime);
		this.noisePP.updateParameter('elapsedTime', elapsedTime);

		this.particlePP.setInputPin('particleTexture',  this.particleTextureSource);
		this.particlePP.updateParameter('deltaTime',  deltaTime/1000);
		this.particlePP.updateParameter('elapsedTime', elapsedTime);
		this.particlePP.setOutputPin( this.particleTextureTarget);

		this.spawnPP.render(renderer);
		this.noisePP.render(renderer, true);
		this.particlePP.render(renderer);

		this.particleSystem.material.
			uniforms.particleTexture.value = this.particleTextureTarget;

		this.swapParticleTexture();

		// particleSystem.rotation.y += 0.01;
		this.elapsedTime += deltaTime;
	}

	CurlNoise.prototype.swapParticleTexture = function(){
		var temp = this.particleTextureSource;
		this.particleTextureSource = this.particleTextureTarget;
		this.particleTextureTarget = temp;
	}

	var shaderStrings = {};
	return {
		spawn : function(options){
			return new CurlNoise(options);
		},
		setShaderStrings : function(_shaderStrings){
			shaderStrings = _shaderStrings;
		}
	}

	function generateSprite( color ){
		var canvas = document.createElement( 'canvas' );
		canvas.width = 128;
		canvas.height = 128;

		var context = canvas.getContext( '2d' );

		context.beginPath();
		context.arc( 64, 64, 60, 0, Math.PI * 2, false) ;
		context.closePath();

		context.restore();

		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );

		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 1, 'rgba(255,255,255,0.0)' );

		context.fillStyle = gradient;

		context.fill();

		return canvas;
	}
})()