define([
    'core/app',
    'app/models/user'
], function(app, User) {

    var _currentUser = null;

    var dropCookie = function(data) {
        var authCookie = {
            user_name: data.user_name,
            user_id: data.id
        };

        $.cookie('auth_token',
            JSON.stringify(authCookie),
            { expires: 7, path: '/' }
        );
    };
    
    app.core.define('AuthModule', function(sandbox) {
        var module = {
            "@ResourcesModule.ready": function(module) {
                // TODO: remove registerController function from app and automate based on, say, "@routes" attribute on module
                var self = this;
                var authCookie = $.cookie('auth_token');
                if (authCookie) {
                    User.load(JSON.parse(authCookie).user_id, function(user) {
                        _currentUser = user;
                        self.publish('success', [_currentUser]);
                        self.ready();
                    });
                } else {
                    this.ready();
                }
            },
            
            signin: function(username, password, success) {
                var self = this;
                $.ajax({
                    type: 'GET',
                    url: '/api/auth?user_name=' + username + '&password=' + password,
                    success: function(data) {
                        _currentUser = new User(data);
                        dropCookie(data);
                        success(_currentUser);
                        self.publish('success', [_currentUser]);
                    },
                    // TODO: error: error,
                    dataType: 'json'
                });
            },
            
            signout: function() {
                _currentUser = null;
                $.cookie('auth_token', null, { path: '/' });
                this.publish('signout');
            },
            
            currentUser: function() {
                return _currentUser;
            }
        };
        
        return module;
    });

});
