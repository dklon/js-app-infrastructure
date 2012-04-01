define([
    'core/app'
], function(app) {

    var _bindings = {};

    function registerTemplate(name, tmpl) {
        tmpl.attr("id", name);
        $('body').append(tmpl);
    }
    
    function bind(bindings) {
        _bindings = _.defaults(bindings, _bindings);
    }
    
    function clearBindings() {
        _bindings = {};
    }
    
    function renderPage(masterName) {
        // render master
        
        var t = $("<div></div>").attr('data-bind', "template: '" + masterName + "'");
        $('[data-tmpl-section=master]').html(t);
        
        ko.applyBindings({});
        
        
        _.each(_bindings, function(binding, sectionName) {
            var $section = $('[data-tmpl-section=' + sectionName + ']');
            
            $section.html($("<div></div>").attr('data-bind', "template: '" + binding.name + "'"));
            
            ko.applyBindings(binding.data || {}, $section[0]);
        });
    }
    
    app.core.define('Templates', function(sandbox) {
        return {
            registerTemplate: registerTemplate,
            bind: bind,
            clearBindings: clearBindings,
            renderPage: renderPage,
        
            "@Application.initialize": function() {
                ko.underscoreTemplateEngine = function () { };
                
                ko.underscoreTemplateEngine.prototype = ko.utils.extend(new ko.templateEngine(), {
                    renderTemplateSource: function (templateSource, bindingContext, options) {
                        // Precompile and cache the templates for efficiency
                        var precompiled = templateSource['data']('precompiled');
                        if (!precompiled) {
                            precompiled = _.template("<% with($data) { %> " + templateSource.text() + " <% } %>");
                            templateSource['data']('precompiled', precompiled);
                        }
                        
                        // bindingContext['$app'] = app;
                        
                        // Run the template and parse its output into an array of DOM elements
                        var renderedMarkup = precompiled(bindingContext).replace(/\s+/g, " ");
                        return ko.utils.parseHtmlFragment(renderedMarkup);
                    },
                    createJavaScriptEvaluatorBlock: function(script) {
                        return "<%= " + script + " %>";
                    }
                });
                
                ko.setTemplateEngine(new ko.underscoreTemplateEngine());
                
                this.ready();
            }
        };
    });
    
    
    // app.tmpl.registerTemplate('header-tmpl', $(..));
    // app.tmpl.registerTemplate('blog-tmpl', $(..));
    // etc.

    // app.tmpl.bind({ header: { name: 'header-tmpl', data: new HeaderViewModel() } });
    
    // app.renderPage({ content: { name: 'blog-tmpl, data: new Blog() } });
    
    

    /*function registerMaster(name, tmpl) {
        var MasterView = Backbone.View.extend({        
            el: $('#main'),            
            
            template: _.template($(tmpl).html()),
            
            initialize: function() {},
            
            render: function(eventName) {
                $(this.el).html(this.template());
                ko.applyBindings({ authorized: function() { return false; } }, $('#header')[0]);
                return this;
            }
        });
        
        _masterViews[name] = new MasterView();
    }
    
    function renderMaster(name) {
        _masterViews[name].render();
    }
    
    function registerTemplate(name, tmpl) {
        tmpl.attr("id", name);
        $('html').append(tmpl);
    }
    
    function renderView(viewName, viewModel, masterName) {
        renderMaster(masterName ? masterName : 'default');
        
        $('#content').html($(
            "<div class='master-content' data-bind='template: \"" + viewName + "\"'></div>"
        ));
        
        var newItem = $('.master-content');
        ko.applyBindings(viewModel ? viewModel : {}, newItem[0]);
    }
    
    app.core.define('Templates', function(sandbox) {
        return {
            registerMaster: registerMaster,
            renderMaster: renderMaster,
            registerTemplate: registerTemplate,    
            renderView: renderView,
        
            "@Application.initialize": function() {
                ko.underscoreTemplateEngine = function () { };
                
                ko.underscoreTemplateEngine.prototype = ko.utils.extend(new ko.templateEngine(), {
                    renderTemplateSource: function (templateSource, bindingContext, options) {
                        // Precompile and cache the templates for efficiency
                        var precompiled = templateSource['data']('precompiled');
                        if (!precompiled) {
                            precompiled = _.template("<% with($data) { %> " + templateSource.text() + " <% } %>");
                            templateSource['data']('precompiled', precompiled);
                        }
                        
                        // bindingContext['$app'] = app;
                        
                        // Run the template and parse its output into an array of DOM elements
                        var renderedMarkup = precompiled(bindingContext).replace(/\s+/g, " ");
                        return ko.utils.parseHtmlFragment(renderedMarkup);
                    },
                    createJavaScriptEvaluatorBlock: function(script) {
                        return "<%= " + script + " %>";
                    }
                });
                
                ko.setTemplateEngine(new ko.underscoreTemplateEngine());
                
                this.ready();
            }
        };
    });*/
    
});