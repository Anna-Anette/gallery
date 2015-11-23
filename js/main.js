jQuery.noConflict()(function ($) {

    $.initMediaEvents = function () {
        var SIZE_SMALL = 768,
            SIZE_MEDIUM = 1024;
        var getViewportWidth = function () {
            var de = document.documentElement;
            if (typeof window.innerWidth != 'undefined') {
                return window.innerWidth;
            } else if (typeof de != 'undefined' && typeof de.clientWidth != 'undefined') {
                return de.clientWidth;
            } else {
                return document.getElementsByTagName('body')[0].clientWidth;
            }
        };
        var lastSize = getViewportWidth();
        var initialized = false;
        var resetMediaVars = function () {
            $.mediaM = $.mediaT = $.mediaD = false;
        };
        var setMediaVar = function (m) {
            resetMediaVars();
            $[m] = true;
        };
        var mediaVars = function () {
            var w = getViewportWidth();
            if (w < SIZE_SMALL) {
                setMediaVar("mediaM");
            } else if (w < SIZE_MEDIUM) {
                setMediaVar("mediaT");
            } else if (w >= SIZE_MEDIUM) {
                setMediaVar("mediaD");
            }
        };
        var mediaTrigger = function () {
            var w = getViewportWidth();
            if (w < SIZE_SMALL && (lastSize >= SIZE_SMALL || !initialized)) {
                setMediaVar("mediaM");
                $(window).trigger("mediaM");
            }
            if (w < SIZE_MEDIUM && (lastSize >= SIZE_MEDIUM || !initialized)) {
                $(window).trigger("mediaMT");
            }
            if ((w >= SIZE_SMALL) && (w < SIZE_MEDIUM) && (lastSize < SIZE_SMALL || lastSize >= SIZE_MEDIUM || !initialized)) {
                setMediaVar("mediaT");
                $(window).trigger("mediaT");
            }
            if (w >= SIZE_SMALL && (lastSize < SIZE_SMALL || !initialized)) {
                $(window).trigger("mediaTD");
            }
            if (w >= SIZE_MEDIUM && (lastSize < SIZE_MEDIUM || !initialized)) {
                setMediaVar("mediaD");
                $(window).trigger("mediaD");
            }
            if (lastSize != w) {
                lastSize = w;
            }
            initialized = true;
        };
        mediaVars(); // init media variables
        setTimeout(function () {
            mediaTrigger(); // init media events
            $(window).on("resize.mediaTrigger", mediaTrigger);
        }, 0);
    };

    $.initMediaEvents();

    function generateSwatches(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (prop !== 'videos') {
                    var span = $('<span>');
                    span
                        .text(prop)
                        .attr('data-swatch', prop)
                        .appendTo($('#swatches'));
                }
            }
        }
    }



    generateSwatches(galleryData);

    ONEPICA.Gallery.init(galleryData, "#product-view-gallery", {
        isQuickView: false
    });

    $(".js-popup").fancybox();
    $('.fancybox-media').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 2,
        wrapCSS: 'fancybox-video',
        helpers: {
            media: {}
        }
    });


    (function () {
        var key;
        $('#swatches').find('span').on('click', function () {
            if(key === $(this).attr('data-swatch')) {
                return;
            }
            ONEPICA.Gallery.switchGalleryView($(this).attr('data-swatch'));
            key = $(this).attr('data-swatch');
        });
    })();

});

