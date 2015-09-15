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
                pager: false
            }
        };

        return {
            params: defaults,
            currentGalleryKey: '',
            currentImagesSet: {},
            $galleryHolderElement: '',
            startingImage: 0,
            isZoomActive: false,
            isMobile: false,
            mobileSliderHolder: '',
            isLoading: true,

            /**
             * Reset params
             */
            isMobileSliderEnabled: false,
            currentThumbIndex: 0,
            noImageIndex: 'undefined',

            /**
             * selectors
             */
            gallery: {},

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

            initialize: function () {
                this.mainEl = this.params.baseParams.mainImageClass;
                this.mainElId = this.params.baseParams.mainImageID;
                this.mainElWrapper = this.params.baseParams.mainImageWrapperClass;

                this.loader = this.params.baseParams.loaderClass;

                this.thumbContainerId = this.params.baseParams.thumbContainerId;
                this.thumbLink = this.params.baseParams.thumbLinkClass;
                this.thumbLinkActive = this.params.baseParams.thumbClassActive;

                this.mobileSliderId = this.params.baseParams.mobileSliderId;
            },

            /**
             * Removes generated gallery
             */
            removeGallery: function () {
                this.$galleryHolderElement.empty();

                this.isMobileSliderEnabled = false;
                this.currentThumbIndex = 0;
                this.noImageIndex = 'undefined';

                this.removeZoom();
            },

            /**
             * Generates gallery
             * @param {string} key - a key of an object with images and options
             */
            generateGallery: function (key) {

                this.currentGalleryKey = key;
                this.currentImagesSet = this.gallery[key].images;

                this.generateMainImage(this.currentImagesSet);
                this.generateGalleryThumbs(this.currentImagesSet);

                if (this.isMobile) {
                    this.hideMainImage();
                }
            },

            showMainImage: function () {
                $('.' + this.mainElWrapper).show();
            },

            hideMainImage: function () {
                $('.' + this.mainElWrapper).hide();
            },

            showLoader: function () {
                $('.' + this.loader).show();
            },

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
             *
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
            generateMainImage: function () {
                var self = this,
                    el = $('.' + this.mainEl);
                el
                    .addClass('loading')
                    .on('load', function () {
                        el.removeClass('loading');
                        self.hideLoader();
                        self.isLoading = false;
                        console.log(self.isLoading);

                    })
                    .on('error', function () {
                        el
                            .attr('src', self.params.noImageUrl)
                            .attr('data-zoom-image', self.params.noImageUrl);
                        self.noImageIndex = el.attr('data-image-index');
                    });

                if (this.isLoading) {
                    console.log(this.isLoading);
                    this.showLoader();
                    this.makeThumbActive(el);
                }
            },

            /**
             * Generates images thumbs from images object
             */
            generateGalleryThumbs: function () {
                var self = this;

                $('.' + this.thumbLink).each(function () {
                    $(this)
                        .on('click', function (e) {
                            e.preventDefault();
                            self.switchGalleryImage($(this).attr('data-image-index'));
                            self.makeThumbActive($(this));
                            if (self.isMobileSliderEnabled) {
                                self.mobileSliderHolder.goToSlide($(this).attr('data-image-index'));
                            }
                        })
                        .find('img')
                        .on('error', function () {
                            $(this).attr('src', self.params.noImageUrl);
                            $(this)
                                .parent()
                                .attr('data-zoom-image', self.params.noImageUrl)
                                .attr('data-image', self.params.noImageUrl);
                            self.noImageIndex = $(this).parent().attr('data-image-index');
                        });
                });

                $('#' + self.mobileSliderId).find('img').each(function () {
                    $(this).on('error', function () {
                        $(this)
                            .attr('src', self.params.noImageUrl);
                    });
                });

                this.makeThumbActive($('.' + this.mainEl));
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
                        console.log($('#' + self.mainElId).width());
                        console.log($('#' + self.mainElId).height());
                        self.hideLoader();
                        self.addZoom($('#' + self.mainElId).width(), $('#' + self.mainElId).height());

                        zoomExists = true;
                    }
                }
            },

            /**
             * Adds mobile slider basing on images thumbs
             */
            addMobileSlider: function () {
                var self = this,
                    sliderID = $('#' + self.mobileSliderId),
                    sliderEl = sliderID.find('.' + self.thumb).find('img');
                if (!this.isMobile) {
                    return;
                }
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
                    }
                });
                this.isMobileSliderEnabled = true;
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
                this.addZoom();
                console.log('makeActive');

            },

            /**
             * Adds image zoom
             *
             * @param {string} [width] - width of image, to set zoom window width
             * @param {string} [height] - height of image, to set zoom window height
             */
            addZoom: function (width, height) {
                var self = this;
                if (this.isMobile || this.params.isQuickView) {
                    return;
                }
                console.log('zoom');

                var mainImage = $('#' + this.mainElId);

                if (!this.isZoomActive && mainImage.attr('data-image-index') !== this.noImageIndex) {
                    mainImage.elevateZoom($.extend({}, self.params.zoomParams, {
                        zoomWindowWidth: width ? width : mainImage.width(),
                        zoomWindowHeight: height ? height : mainImage.height()
                    }));
                    console.log( mainImage.width());
                    console.log( mainImage.width());
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
             * Initialization of desktop view
             * @param {object} self - a main object to refer
             */
            initDesktop: function (self) {
                self.isMobile = false;

                self.showMainImage();

                self.generateGallery(self.currentGalleryKey);
                if (self.isMobileSliderEnabled) {
                    self.removeMobileSlider();
                }
            },

            /**
             * Initialization of mobile view
             * @param {object} self - a main object to refer
             */
            initMobile: function (self) {
                self.isMobile = true;

                self.generateGallery(self.currentGalleryKey);

                self.removeZoom();

                self.hideMainImage();
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
                this.currentImagesSet = this.gallery[this.currentGalleryKey].images;
                this.$galleryHolderElement = $(containerSelector);
                this.startingImage = this.findBaseImage(this.gallery[this.currentGalleryKey].images);
                this.currentThumbIndex = this.startingImage.index;

                this.initialize();

                this.generateHtml(this.getGalleryObject(this.currentGalleryKey));

                if (this.isLoading) {
                    if (this.params.isQuickView) {
                        this.initDesktop(self);
                    }
                    this.initZoomResize();

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
                }
            },
            /**
             * @param {string} galleryKey - a key of gallery view to generate new gallery
             * @returns {object} - an object with current gallery data
             * */
            getGalleryObject: function (galleryKey) {
                if (typeof this.gallery[galleryKey].placeholder !== 'undefined') {
                    return {
                        gal: this.gallery,
                        key: this.gallery[galleryKey],
                        placeholderThumb: this.gallery[galleryKey].placeholder.thumb,
                        placeholderLabel: this.gallery[galleryKey].placeholder.label
                    }
                }
                return {
                    gal: this.gallery,
                    key: this.gallery[galleryKey],
                    baseImage: this.findBaseImage(this.gallery[galleryKey].images)
                };
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

                this.generateHtml(this.getGalleryObject(galleryKey));

                this.generateGallery(galleryKey);

                if (this.isMobile && !this.isMobileSliderEnabled) {
                    this.addMobileSlider();
                }

                this.currentImagesSet = galleryKey;
            }
        }
    })();
})(jQuery);
