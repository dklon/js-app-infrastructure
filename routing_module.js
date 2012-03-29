define([
    'core/app'
], function(app) {

    var _router = new Backbone.Router();
    
    app.core.define('Router', function(sandbox) {
        return {
            "@Application.initialize": function() {
                this.ready();
            },
            "@Application.ready": function() {
                Backbone.history.start();
            },
            route: function(route, name, callback) {
                _router.route(route, name, callback);
            }
        };
    });

});