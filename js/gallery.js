'use strict';

var ONEPICA = ONEPICA || {};
(function ($) {
    ONEPICA.Gallery = ONEPICA.Gallery || {};
    ONEPICA.Gallery = {

        /**
         * Main gallery params
         */
        defaults: {
            /**
             * Is Quick view enabled
             */
            isQuickView: false,

            mainGallerySet: 'gallery_main',
            noImageUrl: "http://36.media.tumblr.com/d226f2dc0af8889dedb6ae010d796595/tumblr_nnkkezir8Z1topm99o1_1280.jpg",

            baseParams: {
                mainImageClass: 'js-main-image',

                thumbClassActive: 'active-thumb',
                thumbElement: 'js-product-image-thumb',
                thumbLinkClass: 'js-thumb-link',
                thumbImageClass: 'js-thumb-image',
                sliderImageClass: 'js-slider-images',

                loaderClass: 'js-loader',
                mobileSliderId: 'mobileSlider',
                resizeTimeout: 500
            },
            /**
             * Extensible zoom parameters
             */
            zoomParams: {
                cursor: 'crosshair',
                borderSize: 0,
                zoomWindowOffetx: 20
            },
            /**
             * Extensible Slider parameters
             */
            sliderParams: {
                pager: false,
                preloadImages: 'all'
            }
        },

        /**
         * Main gallery parameters
         */
        params: {},

        /**
         * Current gallery key
         */
        currentGalleryKey: '',

        /**
         * Gallery HTML wrapper
         */
        $galleryHolderElement: '',

        /**
         * Gallery template element
         */
        templateId: 'template',

        /**
         * Indicates if zoom is active
         */
        isZoomActive: false,

        /**
         * Mobile gallery slider holder element
         */
        mobileSliderHolder: '',

        /**
         * Indicates if image is loading
         */
        isImageLoading: true,

        /**
         * Reset params
         */

        /**
         * Indicates if mobile slider enabled
         */
        isMobileSliderEnabled: false,

        /**
         * Indicates if mobile slider is loading
         */
        isSliderLoading: false,

        /**
         * Current thumb index
         */
        currentThumbIndex: 0,

        /**
         * Class name of an image with broken url
         */
        noImage: 'js-no-image',

        /**
         * Gallery selectors
         */
        gallery: {},

        /**
         * Sort Images array according to base image
         *
         * @param {string} key - a key of current gallery
         */
        sortImages: function (key) {
            var oldImages = this.gallery[key].images,
                newImages = [];

            if (typeof oldImages === 'undefined') {
                return;
            }
            for (var i = 0, k = oldImages.length; i < k; i++) {
                if (oldImages[i].isBase) {
                    newImages.unshift(oldImages[i]);
                } else {
                    newImages.push(oldImages[i]);
                }

                this.gallery[key].images = newImages;
            }
        },

        /**
         * Shows Loader element
         */
        showLoader: function () {
            this.selectors.loader.show();
        },

        /**
         * Hides Loader element
         */
        hideLoader: function () {
            this.selectors.loader.hide();
        },

        /**
         * Generates Main Image object basing on images object
         */
        initMainImage: function () {
            var self = this,
                el = this.selectors.mainImage;
            el
                .on('load', function () {
                    self.hideLoader();
                    self.addZoom();
                    self.isImageLoading = false;
                })
                .on('error', function () {
                    el
                        .addClass(self.noImage)
                        .attr('src', self.params.noImageUrl);
                });
            if (this.isImageLoading) {
                this.showLoader();
            }
        },

        /**
         * Generates images thumbs from images object
         */
        initGalleryThumbs: function () {
            var self = this;

            this.selectors.thumbImages.each(function (index) {
                $(this)
                    .on('load', function () {
                        $(this).animate({
                            opacity: 1
                        });
                        self.initThumb(index);
                    })
                    .on('error', function () {
                        self.initThumbError($(this));
                    });
            });
            this.makeThumbActive();
        },

        /**
         * Initialize thumbs behaviour according to thumb index
         *
         * @param {number} index - an index of a thumb
         */
        initThumb: function (index) {
            var self = this,
                images = this.selectors.thumbImages,
                mainImage = this.selectors.mainImage;

            this.selectors.thumbLinks.eq(index).on('click', function (e) {
                var img = images.eq(index);

                e.preventDefault();

                if (index === self.currentThumbIndex) {
                    return;
                }

                self.switchGalleryImage(index);

                if (img.hasClass(self.noImage)) {
                    self.removeZoom();
                    return;
                }

                if (self.isZoomActive) {
                    mainImage.data('elevateZoom').swaptheimage(img.attr('src'), img.attr('src'));
                } else {
                    self.addZoom();
                }
            });
        },

        /**
         * Initialize Error thumbs behaviour according to thumb element
         *
         * @param {object} thumb - an error thumb
         */
        initThumbError: function (thumb) {
            thumb
                .attr('src', this.params.noImageUrl)
                .addClass(this.noImage);
        },

        /**
         * Initialize mobile Slider elements
         */
        initSliderElements: function () {
            var self = this;

            this.selectors.mobileSliderId.find('img').each(function () {
                $(this)
                    .on('error', function () {
                        $(this)
                            .attr('src', self.params.noImageUrl);
                    });
            });
        },

        /**
         * Zoom resize initialization
         * Sets timeout to prevent resize event fire multiple times
         */
        initZoomResize: function () {
            var currentWindowWidth = window.innerWidth,
                self = this;

            $(window).resize(function () {
                if (window.innerWidth == currentWindowWidth) {
                    return;
                }

                currentWindowWidth = window.innerWidth;

                self.removeZoom();
                self.showLoader();

                clearTimeout(self.zoomTimeout);
                self.zoomTimeout = setTimeout(function () {
                    if (!self.isImageLoading) {
                        self.hideLoader();
                    }
                    self.addZoom();
                }, self.params.baseParams.resizeTimeout)
            });
        },

        /**
         * Adds mobile slider basing on images thumbs
         */
        addMobileSlider: function () {
            if (!this.selectors.mobileSliderId.length) {
                return;
            }
            if (this.isMobileSliderEnabled || this.isSliderLoading) {
                return;
            }

            var self = this;

            this.isSliderLoading = true;

            this.mobileSliderHolder = this.selectors.mobileSliderId.bxSlider($.extend({}, this.params.sliderParams, {
                startSlide: this.currentThumbIndex,

                onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                    self.switchGalleryImage(newIndex);
                },

                onSliderLoad: function () {
                    self.isSliderLoading = false;
                    self.isMobileSliderEnabled = true;
                }
            }));
        },

        /**
         * Removes mobile slider
         */
        removeMobileSlider: function () {
            if (this.isMobileSliderEnabled) {
                this.mobileSliderHolder.destroySlider();
                this.isMobileSliderEnabled = false;
            }
        },

        /**
         * Switches gallery image basing on index of a new image, emulates zoom functionality of image switch
         *
         * @param {number} index - an index of new image to switch to
         */
        switchGalleryImage: function (index) {
            var mainImage = this.selectors.mainImage,
                newThumbImage = this.selectors.thumbImages.eq(index);

            this.currentThumbIndex = index;

            mainImage.attr('src', newThumbImage.attr('src'));
            mainImage.attr('alt', newThumbImage.attr('alt'));

            mainImage.removeClass(this.noImage);

            if (newThumbImage.hasClass(this.noImage)) {
                mainImage.addClass(this.noImage);
            }

            this.makeThumbActive();
        },

        /**
         * Makes gallery thumb active basing on index of a new image, emulates zoom functionality of image switch
         */
        makeThumbActive: function () {
            this.selectors.thumbLinks
                .removeClass(this.params.baseParams.thumbClassActive)
                .eq(this.currentThumbIndex)
                .addClass(this.params.baseParams.thumbClassActive);
        },

        /**
         * Adds image zoom
         *
         * @param {string} [width] - width of image, to set zoom window width
         * @param {string} [height] - height of image, to set zoom window height
         */
        addZoom: function (width, height) {
            var self = this,
                mainImage = this.selectors.mainImage;

            if ($.mediaM || this.params.isQuickView) {
                return;
            }
            if (!this.isZoomActive && !mainImage.hasClass(this.noImage)) {
                mainImage.elevateZoom($.extend({}, self.params.zoomParams, {
                    zoomWindowWidth: width ? width : mainImage.width(),
                    zoomWindowHeight: height ? height : mainImage.height()
                }));
                this.isZoomActive = true;
            }
        },

        /**
         * Removes image zoom
         */
        removeZoom: function () {
            var image = this.selectors.mainImage;

            if (!this.isZoomActive) {
                return;
            }
            $('.zoomContainer').remove();
            image.removeData('elevateZoom');
            image.removeData('zoomImage');
            this.isZoomActive = false;
        },

        /**
         * Removes generated gallery
         */
        removeGallery: function () {
            this.$galleryHolderElement.empty();

            this.isMobileSliderEnabled = false;
            this.currentThumbIndex = 0;
            this.isImageLoading = true;

            this.removeZoom();
        },

        /**
         * Generates gallery
         *
         * @param {string} key -  a key of a gallery to initialize
         */
        initGallery: function (key) {

            this.sortImages(key);

            this.generateHtml(this.getCurrentGalleryData(key));
            this.initializeSelectors();

            this.initMainImage();
            this.initGalleryThumbs();
            this.initSliderElements();

            this.initZoomResize();
        },

        /**
         * Initialization of desktop view
         *
         * @param {*} e - an event
         */
        initDesktop: function (e) {
            e.data.self.removeMobileSlider();
        },

        /**
         * Initialization of mobile view
         *
         * @param {*} e - an event
         */
        initMobile: function (e) {
            e.data.self.addMobileSlider();
        },

        /**
         * Generates an object with Current gallery data
         *
         * @param {string} galleryKey - a key of gallery view to generate new gallery
         * @returns {object} data - an object with current gallery data
         */
        getCurrentGalleryData: function (galleryKey) {
            var data = {},
                gallery = this.gallery[galleryKey];

            if (typeof gallery.placeholder !== 'undefined') {
                data.placeholder = {
                    placeholderThumb: gallery.placeholder.thumb,
                    placeholderLabel: gallery.placeholder.label
                };
            }
            if (typeof gallery.images !== 'undefined') {
                if (gallery.images.length > 1) {
                    data.images = gallery.images;
                }
                data.baseImage = gallery.images[0];
            }
            if (!this.params.isQuickView) {
                data.videos = this.gallery.videos;
            }
            return data;
        },

        /**
         * Generates an HTML for a gallery
         */
        generateHtml: function (data) {
            this.$galleryHolderElement.html(this.template(data));
        },

        /**
         * Initialization of selectors for gallery
         */
        initializeSelectors: function () {
            var rootEl = this.$galleryHolderElement;
            this.selectors = {
                mainImage: rootEl.find($('.' + this.params.baseParams.mainImageClass)),
                loader: rootEl.find($('.' + this.params.baseParams.loaderClass)),

                thumbContainerId: rootEl.find($('#' + this.params.baseParams.thumbContainerId)),
                thumbElements: rootEl.find($('.' + this.params.baseParams.thumbElement)),
                thumbLinks: rootEl.find($('.' + this.params.baseParams.thumbLinkClass)),
                thumbImages: rootEl.find($('.' + this.params.baseParams.thumbImageClass)),
                thumbLinkActive: rootEl.find($('.' + this.params.baseParams.thumbClassActive)),

                mobileSliderId: rootEl.find($('#' + this.params.baseParams.mobileSliderId)),
                mobileSliderImages: rootEl.find($('#' + this.params.baseParams.sliderImageClass))
            };
        },

        /**
         * Initialization of a gallery
         *
         * @param {object} imagesData - json with data
         * @param {string} containerSelector - container for gallery
         * @param {object} [settings] - extra settings for gallery
         */
        init: function (imagesData, containerSelector, settings) {

            this.gallery = imagesData;
            this.params = $.extend(true, {}, this.defaults, settings);
            this.currentGalleryKey = this.params.mainGallerySet;
            this.$galleryHolderElement = $(containerSelector);

            this.template = tmpl(this.templateId);

            this.initGallery(this.currentGalleryKey);

            $(window).on("mediaTD", {self: this}, this.initDesktop);
            $(window).on("mediaM", {self: this}, this.initMobile);
        },

        /**
         * Initialization of mobile view
         *
         * @param {string} galleryKey - a key of gallery view to generate new gallery
         */
        switchGalleryView: function (galleryKey) {
            var e = {
                data: {
                    self: this
                }
            };

            this.removeGallery();
            this.initGallery(galleryKey);

            if ($.mediaM) {
                this.initMobile(e);
            } else {
                this.initDesktop(e);
            }
        }
    }
})(jQuery);
