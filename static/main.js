// seajs config
seajs.config({
	// Enable plugins
  	plugins: ['shim', 'text'],
    base: './',
    map: [
      [ /^(.*\/modules\/.*\/.*\.(?:html|js))(?:.*)$/i, '$1?mobile_build_version' ]
    ]
});

seajs.on('error', function(module){
    if(module.status!=5){
        console.error('seajs error: ', module);
    }
});

//Step2: bootstrap youself
seajs.use(['app.js?mobile_build_version'], function(app){
    angular.bootstrap(document, ['app']);
});