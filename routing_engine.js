define([], function() {

    var _router;
    
    return {
        initialize: function() {
            _router = new Backbone.Router();
        },
        start: function() {
            Backbone.history.start();
        },
        route: function(route, name, callback) {
            _router.route(route, name, callback);
        }
    };

});