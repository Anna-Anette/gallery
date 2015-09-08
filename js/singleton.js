// Singleton ------------------------------------
var OPAL_Gallery = OPAL_Gallery || {};
(function($) {
    OPAL_Gallery = {
        /**
         *
         */
        isQuickView: false,
        /**
         *
         */
         nodes: {

        },
        init: function (isQuickView) {
            this.isQuickView = isQuickView;
        },
        generateGallery: function() {
            this.isQuickView = true;
        }
    }
})(jQuery);

// Constructor ------------------------------------
OPAL_Constructor = function (el) {
    this.el = el
};

OPAL_Constructor.prototype = {
    render: function () {

    }
};

var newObj = new OPAL_Constructor($(".ttt"));
