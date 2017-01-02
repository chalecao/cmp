define(["text!shaders/noise_f.essl",
		"text!shaders/particle_f.essl",
		"text!shaders/particle_v.essl",
		"text!shaders/particlePP_f.essl",
		"text!shaders/snoise_f.essl",
		"text!shaders/spawn_f.essl"], function(noise_f, particle_f, particle_v, particlePP_f, snoise_f, spawn_f){
	
	var shaders = {
		spawnPPFragShader : spawn_f,
		noisePPFragShader : noise_f,
		particlePPFragShader : particlePP_f,
		snoiseFragShader : snoise_f,
		particleVertexShader : particle_v,
		particleFragShader : particle_f
	}

	_.each(shaders, function(item, id){
		shaders[id] = item.replace(/{{([\s\S]*)}}/g, function(str, match){
			return shaders[match];
		});
	})
	return shaders;
})