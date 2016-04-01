jQuery.fn.tcf_quiz = function(options) {

    var defaults = {

    };

    var settings = $.extend( {}, defaults, options );

    var methods = {
        init: function() {

        }
    };

    return this.each(function() {
        settings.elements = {}
        settings.elements.main = $(this)
        methods.init(this)
    });
};
