'use strict';

var ONEPICA = ONEPICA || {};
(function ($) {
    'use strict';
    ONEPICA.Gallery = ONEPICA.Gallery || {};
    ONEPICA.Gallery = (function () {
        var defaults = {

            isQuickView: false,

            mainGallerySet: 'gallery_main',
            noImageUrl: "http://36.media.tumblr.com/d226f2dc0af8889dedb6ae010d796595/tumblr_nnkkezir8Z1topm99o1_1280.jpg",

            baseParams: {
                mainImageWrapperClass: 'js-main-image-wrapper',
                mainImageClass: 'js-main-image',
                mainImageID: 'jsMainImage',

                thumbClassActive: 'active-thumb',
                thumbContainerId: 'thumbsContainer',
                thumbElement: 'js-product-image-thumb',
                thumbLinkClass: 'js-thumb-link',

                loaderClass: 'js-loader',
                mobileSliderId: 'mobileSlider',
                resizeTimeout: 500
            },
            zoomParams: {
                cursor: 'crosshair',
                responsive: true,
                borderSize: 0,
                zoomWindowOffetx: 20
            },
            sliderParams: {
                pager: false,
                preloadImages: 'all'
            }
        };

        return {
            /**
             * Main gallery params
             */
            params: defaults,

            /**
             * Current gallery key
             */
            currentGalleryKey: '',

            /**
             * Gallery HTML wrapper
             */
            $galleryHolderElement: '',

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
                if (typeof this.gallery[key].images === 'undefined') {
                    return;
                }
                for (var i = 0; i < this.gallery[key].images.length; i++) {
                    if (this.gallery[key].images[i].isBase) {
                        Array.prototype.unshift.apply(this.gallery[key].images, this.gallery[key].images.splice(i, this.gallery[key].images.length));
                    }
                }
            },

            /**
             * Initialization of main elements
             */
            initializeElements: function () {
                this.mainEl = this.params.baseParams.mainImageClass;
                this.mainElId = this.params.baseParams.mainImageID;
                this.mainElWrapper = this.params.baseParams.mainImageWrapperClass;

                this.loader = this.params.baseParams.loaderClass;

                this.thumbContainerId = this.params.baseParams.thumbContainerId;
                this.thumbElement = this.params.baseParams.thumbElement;
                this.thumbLink = this.params.baseParams.thumbLinkClass;
                this.thumbLinkActive = this.params.baseParams.thumbClassActive;

                this.mobileSliderId = this.params.baseParams.mobileSliderId;
            },


            /**
             * Shows Main image wrapper
             */
            showMainImage: function () {
                $('.' + this.mainElWrapper).show();
            },

            /**
             * Hides Main image wrapper
             */
            hideMainImage: function () {
                if ($('#' + this.mobileSliderId).children().length) {
                    $('.' + this.mainElWrapper).hide();
                }
            },

            /**
             * Shows Loader element
             */
            showLoader: function () {
                $('.' + this.loader).show();
            },

            /**
             * Hides Loader element
             */
            hideLoader: function () {
                $('.' + this.loader).hide();
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
                    el = $('.' + this.mainEl);
                el
                    .addClass('loading')
                    .on('load', function () {
                        self.hideLoader();
                        self.addZoom();
                        self.isImageLoading = false;
                    })
                    .on('error', function () {
                        el
                            .attr('src', self.params.noImageUrl)
                            .attr('data-zoom-image', self.params.noImageUrl);
                        self.noImageIndex = el.attr('data-image-index');
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

                $('.' + this.thumbElement).each(function () {
                    $(this)
                        .find('img')
                        .on('load', function () {
                            $(this).animate({
                                opacity: 1
                            })
                                .closest('a')
                                .on('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if ($(this).hasClass(self.thumbLinkActive)) {
                                        return;
                                    }
                                    self.switchGalleryImage($(this).attr('data-image-index'));
                                    self.makeThumbActive($(this));
                                    self.addZoom();
                                });
                        })
                        .on('error', function () {
                            $(this).attr('src', self.params.noImageUrl);
                            $(this)
                                .parent()
                                .attr('data-zoom-image', self.params.noImageUrl)
                                .attr('data-image', self.params.noImageUrl);
                            self.noImageIndex = $(this).parent().attr('data-image-index');
                        });
                });
                this.makeThumbActive($('.' + this.mainEl));
            },

            initSliderElements: function () {
                var self = this,
                    sliderId = $('#' + this.mobileSliderId);
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
                var resizeInProgress = false,
                    zoomExists = true,
                    currentWindowWidth = window.innerWidth,
                    self = this;

                $(window).resize(function () {
                    if (window.innerWidth == currentWindowWidth) {
                        return;
                    }

                    currentWindowWidth = window.innerWidth;
                    if (resizeInProgress === false) {
                        if (zoomExists) {
                            self.removeZoom();
                            self.showLoader();
                            zoomExists = false;
                            setTimeout(checkResizeProgress, self.params.baseParams.resizeTimeout);
                        }
                    }
                    resizeInProgress = true;
                });

                function checkResizeProgress() {
                    if (resizeInProgress) {
                        setTimeout(checkResizeProgress, self.params.baseParams.resizeTimeout);
                        resizeInProgress = false;
                    } else {
                        if (!self.isImageLoading) {
                            self.hideLoader();
                        }
                        self.addZoom();
                        zoomExists = true;
                    }
                }
            },

            /**
             * Adds mobile slider basing on images thumbs
             */
            addMobileSlider: function () {
                var self = this,
                    sliderID = $('#' + self.mobileSliderId);

                if (!sliderID.length) {
                    return;
                }

                if (self.isMobileSliderEnabled || self.isSliderLoading ){
                    return;
                }

                self.isSliderLoading = true;

                this.mobileSliderHolder = sliderID.bxSlider({
                    pager: self.params.sliderParams.pager,
                    startSlide: self.currentThumbIndex,
                    onSlideNext: function (currentSlide) {
                        self.currentThumbIndex = currentSlide.attr('data-image-index');
                        self.switchGalleryImage(self.currentThumbIndex);
                        self.makeThumbActive(currentSlide);
                    },
                    onSlidePrev: function (currentSlide) {
                        self.currentThumbIndex = currentSlide.attr('data-image-index');
                        self.switchGalleryImage(self.currentThumbIndex);
                        self.makeThumbActive(currentSlide);
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
                var mainImage = this.$galleryHolderElement.find($('.' + this.mainEl)),
                    newImage = $('#' + this.thumbContainerId).find("[data-image-index='" + index + "']");

                this.currentThumbIndex = index;
                mainImage.attr('data-image-index', index);
                mainImage.attr('data-zoom-image', $(newImage).attr('data-zoom-image'));
                mainImage.attr('src', $(newImage).attr('data-zoom-image'));
                mainImage.attr('alt', $(newImage).find('img').attr('alt'));
            },

            /**
             * Makes gallery thumb active basing on index of a new image, emulates zoom functionality of image switch
             *
             *  @param {string} thumb - a thumb of image to switch to
             */
            makeThumbActive: function (thumb) {
                var index = $(thumb).attr('data-image-index'),
                    $links = $('#' + this.thumbContainerId);
                $links
                    .find('.' + this.thumbLink)
                    .removeClass(this.thumbLinkActive);
                this.removeZoom();

                $links
                    .find("[data-image-index='" + index + "']")
                    .addClass(this.thumbLinkActive);
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
                var mainImage = $('#' + this.mainElId);

                if (!this.isZoomActive && mainImage.attr('data-image-index') !== this.noImageIndex) {
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

                var image = $('.' + this.mainEl);
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
            initGallery: function () {

                this.initMainImage();
                this.initGalleryThumbs();
                this.initSliderElements();

                this.initZoomResize();

                if ($.mediaM) {
                    this.hideMainImage();
                }
            },
            /**
             * Initialization of desktop view
             * @param {object} self - a main object to refer
             */
            initDesktop: function (self) {

                self.removeMobileSlider();

                self.showMainImage();

                self.initGallery();

            },

            /**
             * Initialization of mobile view
             * @param {object} self - a main object to refer
             */
            initMobile: function (self) {

                self.initGallery();

                self.removeZoom();
                self.hideLoader();

                if (!self.isMobileSliderEnabled) {
                    self.addMobileSlider();
                }
            },

            /**
             * Initialization of mobile view
             *
             * @param {object} imagesData - json with data
             * @param {string} containerSelector - container for gallery
             * @param {object} [settings] - extra settings for gallery
             */
            init: function (imagesData, containerSelector, settings) {
                var self = this;
                this.gallery = imagesData;

                this.sortImages(self.params.mainGallerySet);

                this.params = $.extend(true, {}, defaults, settings);
                this.currentGalleryKey = this.params.mainGallerySet;

                this.$galleryHolderElement = $(containerSelector);
                this.startingImage = this.findBaseImage(this.gallery[this.currentGalleryKey].images);
                this.currentThumbIndex = this.startingImage.index;

                this.initializeElements();

                this.generateHtml(this.getCurrentGalleryData(this.currentGalleryKey));

                if (this.params.isQuickView) {
                    this.initDesktop(self);
                }

                $(window).on("mediaTD",
                    function () {
                        self.initDesktop(self);
                    }
                );
                $(window).on("mediaM",
                    function () {
                        self.initMobile(self);
                    }
                );
            },
            /**
             * @param {string} galleryKey - a key of gallery view to generate new gallery
             * @returns {object} data - an object with current gallery data
             * */
            getCurrentGalleryData: function (galleryKey) {
                var data = {};

                if (typeof this.gallery[galleryKey].placeholder !== 'undefined') {
                    data.placeholder = {
                        placeholderThumb: this.gallery[galleryKey].placeholder.thumb,
                        placeholderLabel: this.gallery[galleryKey].placeholder.label
                    };
                }

                if (typeof this.gallery[galleryKey].images !== 'undefined') {
                    if (this.gallery[galleryKey].images.length > 1) {
                        data.images = this.gallery[galleryKey].images;
                    }
                    data.baseImage = this.findBaseImage(this.gallery[galleryKey].images);
                }

                if (!this.params.isQuickView) {
                    data.videos = this.gallery.videos;
                }

                return data;
            },

            generateHtml: function (data) {
                var template = $("#template").html(),
                    content = tmpl(template, data);
                $("#product-view-gallery").html(content);
            },

            /**
             * Initialization of mobile view
             *
             * @param {string} galleryKey - a key of gallery view to generate new gallery
             */
            switchGalleryView: function (galleryKey) {
                this.removeGallery();
                this.sortImages(galleryKey);

                this.generateHtml(this.getCurrentGalleryData(galleryKey));

                this.initGallery();

                if ($.mediaM && !this.isMobileSliderEnabled) {
                    this.addMobileSlider();
                }
            }
        }
    })
    ();
})
(jQuery);
