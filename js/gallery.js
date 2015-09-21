'use strict';

var ONEPICA = ONEPICA || {};
(function ($) {
    ONEPICA.Gallery = ONEPICA.Gallery || {};
    ONEPICA.Gallery = {

        /**
         * Main gallery params
         */
        defaults: {

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
            zoomParams: {
                cursor: 'crosshair',
                borderSize: 0,
                zoomWindowOffetx: 20
            },
            sliderParams: {
                pager: false,
                preloadImages: 'all'
            }
        },

        /**
         * Main gallery params
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
        $templateId: '#template',

        /**
         * Gallery starting image
         */
        startingImage: 0,

        /**
         * Indicates if zoom is active
         */
        isZoomActive: false,

        /**
         * Mobile gallery slider HTML element
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
         * Index of a broken url image
         */
        noImageIndex: 'undefined',

        /**
         * Gallery selectors
         */
        gallery: {},

        /**
         * Sort Images array according to base image
         */
        sortImages: function (key) {
            var oldImages = this.gallery[key].images,
                newImages = [];

            if (typeof oldImages === 'undefined') {
                return;
            }
            for (var i = 0; i < oldImages.length; i++) {
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
         * Finds base image basing on images object
         *
         * @param {object} imagesData - an object with images
         * @param {string} imagesData.label - image alt
         * @param {string} imagesData.thumb - image src
         * @param {bool} imagesData.isBase - is image a base image flag
         * @returns {object} {} - an object with images data
         */
        findBaseImage: function (imagesData) {
            if (typeof imagesData === 'undefined') {
                return {
                    index: 0,
                    label: this.gallery[this.currentGalleryKey].placeholder.label,
                    thumb: this.gallery[this.currentGalleryKey].placeholder.thumb
                };
            }
            for (var i = 0; i < imagesData.length; i++) {
                if (imagesData[i].isBase) {
                    return {
                        index: i,
                        label: imagesData[i].label,
                        src: imagesData[i].thumb
                    };
                }
            }
            return {
                index: 0,
                label: imagesData[0].label,
                src: imagesData[0].thumb
            }
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
                        .attr('src', self.params.noImageUrl)
                        .attr('data-zoom-image', self.params.noImageUrl);
                });
            if (this.isImageLoading) {
                this.showLoader();
            }
        },
        /**
         * Generates images thumbs from images object
         */
        initGalleryThumbs: function () {
            var self = this,
                images = this.selectors.thumbImages,
                links = this.selectors.thumbLinks;

            images.each(function (index) {
                $(this)
                    .on('load', function () {
                        $(this).animate({
                            opacity: 1
                        });
                        links.eq(index).on('click', function () {
                            if (index === self.currentThumbIndex) {
                                return;
                            }
                            self.removeZoom();
                            self.switchGalleryImage(index);
                            self.addZoom();
                            return false;
                        });
                    })
                    .on('error', function () {
                        $(this).attr('src', self.params.noImageUrl);
                        links.eq(index)
                            .attr('data-zoom-image', self.params.noImageUrl)
                        self.noImageIndex = index;
                    });
            });
            this.makeThumbActive();
        },

        initSliderElements: function () {
            var self = this,
                sliderId = this.selectors.mobileSliderId;

            sliderId.find('img').each(function () {
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

            var self = this,
                sliderId = this.selectors.mobileSliderId;

            this.isSliderLoading = true;

            this.mobileSliderHolder = sliderId.bxSlider({
                pager: self.params.sliderParams.pager,
                startSlide: self.currentThumbIndex,
                onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                    self.switchGalleryImage(newIndex);
                },
                onSliderLoad: function () {
                    self.isSliderLoading = false;
                    self.isMobileSliderEnabled = true;
                }
            });
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
                newThumb = this.selectors.thumbLinks.eq(index),
                newThumbImage = this.selectors.thumbImages.eq(index);

            this.currentThumbIndex = index;
            mainImage.attr('data-zoom-image', newThumb.attr('data-zoom-image'));
            mainImage.attr('src', newThumb.attr('data-zoom-image'));
            mainImage.attr('alt', newThumbImage.attr('alt'));

            this.makeThumbActive();
        },

        /**
         * Makes gallery thumb active basing on index of a new image, emulates zoom functionality of image switch
         */
        makeThumbActive: function () {
            var activeClass = this.params.baseParams.thumbClassActive;
            this.selectors.thumbLinks
                .removeClass(activeClass)
                .eq(this.currentThumbIndex)
                .addClass(activeClass);
        },

        /**
         * Adds image zoom
         *
         * @param {string} [width] - width of image, to set zoom window width
         * @param {string} [height] - height of image, to set zoom window height
         */
        addZoom: function (width, height) {
            var self = this;
            if ($.mediaM || this.params.isQuickView) {
                return;
            }
            var mainImage = this.selectors.mainImage;

            if (!this.isZoomActive && this.currentThumbIndex !== this.noImageIndex) {
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
            if (!this.isZoomActive) {
                return;
            }

            var image = this.selectors.mainImage;
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
            this.noImageIndex = 'undefined';
            this.isImageLoading = true;

            this.removeZoom();
        },

        /**
         * Generates gallery
         */
        initGallery: function (key) {
            this.generateAndInitHtml(key);
            this.initializeSelectors();

            this.initMainImage();
            this.initGalleryThumbs();
            this.initSliderElements();

            this.initZoomResize();
        },
        /**
         * Initialization of desktop view
         */
        initDesktop: function (e) {
            var self = e.data.self;
            self.removeMobileSlider();
        },

        /**
         * Initialization of mobile view
         */
        initMobile: function (e) {
            var self = e.data.self;

            self.removeZoom();
            self.hideLoader();
            self.addMobileSlider();
        },

        /**
         * @param {string} galleryKey - a key of gallery view to generate new gallery
         * @returns {object} data - an object with current gallery data
         * */
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
                data.baseImage = this.findBaseImage(gallery.images);
            }

            if (!this.params.isQuickView) {
                data.videos = this.gallery.videos;
            }

            return data;
        },

        generateAndInitHtml: function (data) {
            var template = $(this.$templateId).html(),
                content = tmpl(template, data);
            this.$galleryHolderElement.html(content);
        },

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
         * Initialization of gallery
         *
         * @param {object} imagesData - json with data
         * @param {string} containerSelector - container for gallery
         * @param {object} [settings] - extra settings for gallery
         */
        init: function (imagesData, containerSelector, settings) {
            var self = this;

            this.gallery = imagesData;

            this.params = $.extend(true, {}, this.defaults, settings);

            this.currentGalleryKey = this.params.mainGallerySet;
            this.$galleryHolderElement = $(containerSelector);

            this.sortImages(self.params.mainGallerySet);

            this.startingImage = this.findBaseImage(this.gallery[this.currentGalleryKey].images);
            this.currentThumbIndex = this.startingImage.index;

            this.initGallery(this.getCurrentGalleryData(this.currentGalleryKey));

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
            this.sortImages(galleryKey);

            this.initGallery(this.getCurrentGalleryData(galleryKey));

            if ($.mediaM) {
                this.initMobile(e);
            } else {
                this.initDesktop(e);
            }
        }
    }
})(jQuery);
