'use strict';
var galleryData = {
    videos: [
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://iqlab.ua/test/gallery/thumb5.jpg"
        },
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://iqlab.ua/test/gallery/thumb5.jpg"
        }
    ],
    gallery_main: {
        images: [
            {
                isBase: true,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb4.jpg"
            },
            {
                isBase: false,
                label: "image #2",
                thumb: "http://iqlab.ua/test/gallery/thumb5.jpg"
            },
            {
                isBase: false,
                label: "image #3",
                thumb: "http://iqlab.ua/test/gallery/thumb6.jpg"
            },
            {
                isBase: false,
                label: "image #4",
                thumb: "http://iqlab.ua/test/gallery/thumb7.jpg"
            },
            {
                isBase: false,
                label: "image #5",
                thumb: "http://iqlab.ua/test/gallery/thumb8.jpg"
            },
            {
                isBase: false,
                label: "image #0",
                thumb: "http://iqlab.ua/test/gallery/thumb0_000.png"
            },
            {
                isBase: false,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb1.png"
            },
            {
                isBase: false,
                label: "image #2",
                thumb: "http://iqlab.ua/test/gallery/thumb2.png"
            },
            {
                isBase: false,
                label: "image #3",
                thumb: "http://iqlab.ua/test/gallery/thumb3.png"
            }
        ]
    },
    gallery_error: {
        images: [
            {
                isBase: false,
                label: "image #0",
                thumb: "http://iqlab.ua/test/gallery/thumb0_000.png"
            },
            {
                isBase: true,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb1.png"
            },
            {
                isBase: false,
                label: "image #2",
                thumb: "http://iqlab.ua/test/gallery/thumb2.png"
            },
            {
                isBase: false,
                label: "image #3",
                thumb: "http://iqlab.ua/test/gallery/thumb3.png"
            }
        ]
    },
    gallery_image: {
        images: [
            {
                isBase: false,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb8.jpg"
            }
        ]
    },
    gallery_placeholder: {
        placeholder: {
            label: "image #1",
            thumb: "http://36.media.tumblr.com/d226f2dc0af8889dedb6ae010d796595/tumblr_nnkkezir8Z1topm99o1_1280.jpg"
        }
    }
};

var ONEPICA = ONEPICA || {};

(function ($) {
    'use strict';
    ONEPICA.Gallery = ONEPICA.Gallery || {};
    ONEPICA.Gallery = (function () {
        var defaults = {

            isQuickView: false,

            mainGallerySet: 'gallery_main',
            videosDataName: 'videos',
            noImageUrl: "http://iqlab.ua/test/gallery/thumb3.png",

            baseParams: {
                mainImageWrapperClass: 'js-main-image-wrapper',
                mainImageClass: 'js-main-image',
                mainImageID: 'jsMainImage',

                thumbClass: 'thumb-element',
                thumbClassActive: 'active-thumb',
                thumbContainerClass: 'product-view-image-thumbs',
                thumbContainerId: 'thumbsContainer',
                thumbItemClass: 'product-image-thumb',
                thumbLinkClass: 'js-thumb-link',
                thumbImgClass: 'js-thumb-image',

                thumbVideoItemClass: 'product-video-thumb',
                thumbVideoLinkClass: 'product-video-link',
                thumbVideoContainer: 'product-video-thumbs-container',

                loaderClass: 'js-loader',
                loaderUrl: 'https://www.myaultcare.com/image/loading.gif',
                popupClass: 'fancybox-media js-popup',
                hiddenClass: 'is-hidden',

                thumbsTitleClass: 'product-view-subtitle',
                thumbsTitleText: 'More views',

                mobileSliderId: 'mobileSlider',
                mobileSliderClass: 'js-mobile-slider',

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

            /**
             * Reset params
             */
            isMainImageExist: false,
            isThumbsGalleryExist: false,
            isVideoGalleryExist: false,
            isMobileSliderEnabled: false,
            currentThumbIndex: 0,
            noImageIndex: 'undefined',

            /**
             * selectors
             */
            mainEl: '',
            mainElWrapper: '',
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
                this.loaderUrl = this.params.baseParams.loaderUrl;

                this.thumbContainer = this.params.baseParams.thumbContainerClass;
                this.thumbContainerId = this.params.baseParams.thumbContainerId;
                this.thumb = this.params.baseParams.thumbItemClass;
                this.thumbLink = this.params.baseParams.thumbLinkClass;
                this.thumbLinkActive = this.params.baseParams.thumbClassActive;

                this.hidden = this.params.baseParams.hiddenClass;
                this.mobileSliderId = this.params.baseParams.mobileSliderId;
                this.mobileSliderClass = this.params.baseParams.mobileSliderId;
            },

            /**
             * Removes generated gallery
             */
            removeGallery: function () {
                this.$galleryHolderElement.empty();

                this.isMainImageExist = false;
                this.isThumbsGalleryExist = false;
                this.isVideoGalleryExist = false;
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

                if (typeof this.gallery[key].placeholder !== 'undefined') {
                    this.generatePlaceholder(key);
                    this.generateVideoThumbs();
                    return;
                }

                this.currentImagesSet = this.gallery[key].images;

                this.generateMainImage(this.currentImagesSet);
                this.generateGalleryThumbs(this.currentImagesSet);

                if (this.isMobile && this.isThumbsGalleryExist) {
                    this.hideMainImage();
                }
            },

            hideMainImage: function () {
                $('.' + this.mainElWrapper).addClass(this.hidden);
            },

            showMainImage: function () {
                $('.' + this.mainElWrapper).removeClass(this.hidden);
            },

            addLoader: function () {
                var loader =
                    $('<div/>')
                        .addClass(this.loader)
                        .appendTo($('.' + this.mainElWrapper));
                $('<span/>')
                    .attr('src', this.loaderUrl)
                    .appendTo(loader);
            },

            showLoader: function () {
                $('.' + this.loader).show();
            },

            hideLoader: function () {
                $('.' + this.loader).hide();
            },

            getMainImageDimensions: function () {
                var mainImage = $('.' + this.mainElWrapper);
                return {
                    width: mainImage.width(),
                    height: mainImage.width()
                }
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
             * Creates placeholder of an image basing on placeholder key name
             *
             * @param {string} placeholderKey - a key for placeholder info
             * @param {string} placeholderKey.placeholder.thumb - an src to placeholder image
             *
             */
            generatePlaceholder: function (placeholderKey) {
                if (this.isMainImageExist) {
                    return;
                }

                var self = this,
                    el = $('<img />'),
                    wrapper = $('<div>')
                        .addClass(this.mainElWrapper)
                        .appendTo(this.$galleryHolderElement),
                    baseImageDimensions = this.getMainImageDimensions();

                el
                    .addClass(self.mainEl)
                    .attr('src', this.gallery[placeholderKey].placeholder.thumb)
                    .appendTo(wrapper)
                    .css({opacity: 0})
                    .on('error', function () {
                        el.attr('src', self.params.noImageUrl)
                    })
                    .on('load', function () {
                        el.css(
                            {
                                opacity: 1,
                                width: 'auto',
                                height: 'auto'
                            }
                        );
                        self.hideLoader();
                    });
                el.css(
                    {
                        width: baseImageDimensions.width,
                        height: baseImageDimensions.height
                    }
                );
                this.addLoader();
                this.showLoader();
                this.isMainImageExist = true;
            },

            /**
             * Generates Main Image object basing on images object
             * @param {object} imagesData - an object with images
             *
             */
            generateMainImage: function (imagesData) {
                if (this.isMainImageExist) {
                    return;
                }
                var self = this,
                    el = $('<img />'),
                    baseImageWrapper = $('<div>')
                        .addClass(self.mainElWrapper)
                        .appendTo(self.$galleryHolderElement),
                    baseImageData = this.findBaseImage(imagesData),
                    baseImageDimensions = this.getMainImageDimensions();

                el
                    .addClass(self.mainEl)
                    .attr('src', baseImageData.src)
                    .attr('alt', baseImageData.label)
                    .attr('id', self.mainElId)
                    .attr('data-image-index', baseImageData.index)
                    .attr('data-zoom-image', baseImageData.src)

                    .appendTo(baseImageWrapper)
                    .css({opacity: 0})
                    .on('load', function () {
                        el.css(
                            {
                                opacity: 1,
                                width: 'auto',
                                height: 'auto'
                            }
                        );
                        self.hideLoader();
                    })
                    .on('error', function () {
                        el
                            .attr('src', self.params.noImageUrl)
                            .attr('data-zoom-image', self.params.noImageUrl);
                        self.noImageIndex = el.attr('data-image-index');
                    });
                this.addLoader();

                el.css(
                    {
                        width: baseImageDimensions.width,
                        height: baseImageDimensions.height
                    }
                );
                this.makeThumbActive($('.' + this.mainEl));

                this.isMainImageExist = true;

                if (this.isMobile && this.isThumbsGalleryExist) {
                    this.hideLoader();
                    baseImageWrapper.hide();
                } else {
                    this.showLoader();
                    baseImageWrapper.show();
                }
                this.getMainImageDimensions();
            },

            /**
             * Generates Video thumbs container
             */
            findOrCreateVideoThumbsContainer: function () {
                if (this.isMobile || !this.isThumbsGalleryExist) {
                    return $('<ul/>')
                        .addClass(this.thumbContainer)
                        .appendTo(this.$galleryHolderElement);
                }
                return this.$galleryHolderElement.find('.' + this.thumbContainer);
            },

            /**
             * Creates Thumbs title
             * @returns {string}
             */
            createThumbsTitle: function () {
                return $('<h3/>')
                    .addClass(this.params.baseParams.thumbsTitleClass)
                    .text(this.params.baseParams.thumbsTitleText);
            },

            /**
             * Creates Thumbs container
             * @returns {string}
             */
            createThumbsContainer: function (id, className) {
                return $('<ul/>')
                    .attr('id', id)
                    .addClass(className);
            },

            /**
             * Generates Video thumbs basing on videos object
             * @param {string} [parentElement] - container for video thumbs
             */
            generateVideoThumbs: function (parentElement) {
                if (this.isVideoGalleryExist || this.params.isQuickView) {
                    return;
                }

                if (typeof this.gallery[this.params.videosDataName] === 'undefined') {
                    this.isVideoGalleryExist = false;
                    return;
                }

                var videoData = this.gallery[this.params.videosDataName],
                    container = parentElement ? parentElement : this.findOrCreateVideoThumbsContainer(),
                    self = this;

                $.each(videoData, function (videoIndex) {
                        var li = $('<li/>')
                                .addClass(self.thumb)
                                .addClass(self.params.baseParams.thumbVideoItemClass)
                                .appendTo(container),
                            span = $('<span/>')
                                .addClass(self.params.baseParams.thumbClass)
                                .addClass(self.params.baseParams.thumbVideoLinkClass)
                                .addClass(self.params.baseParams.popupClass)
                                .attr('data-fancybox-href', videoData[videoIndex].url)
                                .appendTo(li),
                            img = $('<img/>')
                                .addClass(self.params.baseParams.thumbImgClass)
                                .attr('src', videoData[videoIndex].thumb)
                                .appendTo(span);
                    }
                );
                this.isVideoGalleryExist = true;
            },


            /**
             * Generates images thumbs from images object
             *
             * @param {object} imagesData - an object with images
             * @param {string} imagesData.thumb - an url of image
             * @param {string} imagesData.label - an alt of image
             */
            generateGalleryThumbs: function (imagesData) {
                if (this.isThumbsGalleryExist) {
                    return;
                }
                var self = this;

                if (imagesData.length <= 1 || this.isThumbsGalleryExist) {
                    this.generateVideoThumbs();
                    this.isThumbsGalleryExist = false;
                    return this.isThumbsGalleryExist;
                }
                var container = this.createThumbsContainer(self.thumbContainerId, self.thumbContainer),
                    title = this.createThumbsTitle();

                container.appendTo(this.$galleryHolderElement);
                title.insertBefore(container);

                $.each(imagesData, function (imageIndex) {
                    var li = $('<li/>')
                            .addClass(self.thumb)
                            .appendTo(container),
                        a = $('<a/>')
                            .addClass(self.thumbLink + ' ' + self.params.baseParams.thumbClass)
                            .attr('data-image-index', imageIndex)
                            .attr('href', '#')
                            .attr('data-zoom-image', imagesData[imageIndex].thumb)
                            .attr('data-image', imagesData[imageIndex].thumb)

                            .on('click', function (e) {
                                e.preventDefault();
                                self.switchGalleryImage($(this).attr('data-image-index'));
                                self.makeThumbActive($(this));
                                if (self.isMobileSliderEnabled) {
                                    self.mobileSliderHolder.goToSlide($(this).attr('data-image-index'));
                                }
                            })
                            .appendTo(li),
                        img = $('<img/>')
                            .addClass(self.params.baseParams.thumbImgClass)
                            .attr('src', imagesData[imageIndex].thumb)
                            .on('error', function () {
                                img.attr('src', self.params.noImageUrl);
                                img
                                    .parent()
                                    .attr('data-zoom-image', self.params.noImageUrl)
                                    .attr('data-image', self.params.noImageUrl);
                                self.noImageIndex = img.parent().attr('data-image-index');
                            })
                            .attr('alt', '' + imagesData[imageIndex].label)
                            .appendTo(a);
                });
                this.makeThumbActive($('.' + this.mainEl));

                this.generateVideoThumbs(container);
                this.generateSliderElements(imagesData);

                this.isThumbsGalleryExist = true;
            },

            /**
             * Generates images thumbs from images object
             *
             * @param {object} imagesData - an object with images
             * @param {string} imagesData.thumb - an url of image
             * @param {string} imagesData.label - a label of image
             */
            generateSliderElements: function (imagesData) {
                if (this.isThumbsGalleryExist) {
                    return;
                }
                var container = this.createThumbsContainer(this.mobileSliderId, this.mobileSliderId),
                    self = this;

                container.prependTo(this.$galleryHolderElement);

                $.each(imagesData, function (imageIndex) {
                    var div = $('<li/>')
                            .addClass(self.thumb)
                            .attr('data-image-index', imageIndex)
                            .appendTo(container),
                        img = $('<img/>')
                            .attr('src', imagesData[imageIndex].thumb)
                            .on('error', function () {
                                img.attr('src', self.params.noImageUrl);
                            })
                            .attr('alt', '' + imagesData[imageIndex].label)
                            .appendTo(div);
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
                        self.hideLoader();
                        self.addZoom();
                        zoomExists = true;
                    }
                }
            },

            /**
             * Adds mobile slider basing on images thumbs
             */
            addMobileSlider: function () {
                var self = this;
                if (!this.isMobile || !this.isThumbsGalleryExist) {
                    return;
                }

                this.mobileSliderHolder = $('#' + self.mobileSliderId).bxSlider({
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
                    newImage = $('.' + this.thumbContainer).find("[data-image-index='" + index + "']");

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
                    $links = $('.' + this.thumbContainer);
                $links
                    .find('.' + this.thumbLink)
                    .removeClass(this.thumbLinkActive);
                this.removeZoom();

                $links
                    .find("[data-image-index='" + index + "']")
                    .addClass(this.thumbLinkActive);
                this.addZoom();
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
             * Initialization of desktop view
             * @param {object} self - a main object to refer
             */
            initDesktop: function (self) {
                self.isMobile = false;

                if (self.isMainImageExist) {
                    self.showMainImage();
                }
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

                //hides main image only if there more than one gallery image
                if (self.isThumbsGalleryExist) {
                    self.hideMainImage();
                }

                if (!self.isMobileSliderEnabled && self.isThumbsGalleryExist) {
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

                this.params = $.extend(true, {}, defaults, settings);
                this.currentGalleryKey = this.params.mainGallerySet;
                this.currentImagesSet = this.gallery[this.currentGalleryKey].images;
                this.$galleryHolderElement = $(containerSelector);
                this.startingImage = this.findBaseImage(this.gallery[this.currentGalleryKey].images);
                this.currentThumbIndex = this.startingImage.index;

                this.sortImages(self.params.mainGallerySet);
                this.initialize();

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
            },
            /**
             * @param {string} galleryKey - a key of gallery view to generate new gallery
             * @returns {object} - an object with current gallery data
             * */
            getGalleryObject: function (galleryKey) {
                return {
                    gal: this.gallery,
                    key: this.gallery[galleryKey],
                    baseImage: this.findBaseImage(this.gallery[galleryKey].images)
                };
            },
            /**
             * Initialization of mobile view
             *
             * @param {string} galleryKey - a key of gallery view to generate new gallery
             */
            switchGalleryView: function (galleryKey) {
                this.removeGallery();
                this.getGalleryObject(galleryKey);
                this.sortImages(galleryKey);
                this.generateGallery(galleryKey);
                if (this.isMobile && !this.isMobileSliderEnabled) {
                    this.addMobileSlider();
                }
                this.currentImagesSet = galleryKey;
            }
        }
    })();
})(jQuery);
