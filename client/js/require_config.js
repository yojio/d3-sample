// requirejs設定
var require = {
			baseUrl : '/js',
			paths : {
				jquery : [ 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery' ],
				underscore : [ 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore' ],
				backbone : ['https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone'],
                marionette : ['https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.1/backbone.marionette']
			},

			shim : {
				underscore : {
					exports : '_'
				},
			}
		};