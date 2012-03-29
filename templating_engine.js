define([], function(masterView) {

    var _masterViews = {};
    
    function registerMaster(name, tmpl) {
        var MasterView = Backbone.View.extend({        
            el: $('#main'),            
            
            template: _.template($(tmpl).html()),
            
            initialize: function() {},
            
            render: function(eventName) {
                $(this.el).html(this.template());
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

    return {
        registerMaster: registerMaster,
        renderMaster: renderMaster,
        registerTemplate: registerTemplate,    
        renderView: renderView,
    
        initialize: function() {
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
        }
    };

});