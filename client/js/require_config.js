// requirejs設定
var require = {
    baseUrl: '/js',
    paths: {
        jquery: ['https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery'],
        bootstrap: ['https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap'],
        underscore: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore'],
        backbone: ['https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone'],
        marionette: ['https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.1/backbone.marionette'],
        d3: ['https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3']
    },

    shim: {
        bootstrap: {
            deps: ["jquery"],
            exports: 'bootstrap'
        },
        underscore: {
            exports: '_'
        }
    }

};