define([
    'core/app'
], function(app) {

    var _router = new Backbone.Router();
    
    var navigate = function(href) {
        if (href[0] == "/") {
            href = href.substring(1, href.length);
        }
        _router.navigate(href, true);
    };        
    
    app.core.define('Router', function(sandbox) {
        return {
            "@Application.initialize": function() {
                $(document).on("click", ".nav-to", function(event){
                    event.preventDefault();
                    var href = $(event.currentTarget).attr("href");
                    navigate(href);
                });
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