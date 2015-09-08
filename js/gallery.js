'use strict';
var galleryData = {
    videos: [
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://stylishhdwallpapers.com/wp-content/uploads/2015/07/Warcraft-Horde-DoomHammer-HD-Wallpaper.jpg"
        },
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://stylishhdwallpapers.com/wp-content/uploads/2015/07/Warcraft-Horde-DoomHammer-HD-Wallpaper.jpg"
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
var galleryData2 = {
    videos: [
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://iqlab.ua/test/gallery/video_thumb1.jpg"
        },
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://iqlab.ua/test/gallery/video_thumb2.jpg"
        }
    ],
    gallery_main: {
        images: [
            {
                isBase: 1,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb4.jpg"
            },
            {
                isBase: 0,
                label: "image #4",
                thumb: "http://iqlab.ua/test/gallery/thumb7.jpg"
            },
            {
                isBase: 0,
                label: "image #5",
                thumb: "http://iqlab.ua/test/gallery/thumb8.jpg"
            }
        ]
    },
    gallery_new: {
        images: [
            {
                isBase: 1,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb1.png"
            },
            {
                isBase: 0,
                label: "image #2",
                thumb: "http://iqlab.ua/test/gallery/thumb2.png"
            },
            {
                isBase: 0,
                label: "image #3",
                thumb: "https://daniellereviewsmovingpictures.files.wordpress.com/2015/06/11141364_680145855424272_7135930776227614345_o.jpg"
            },
            {
                isBase: 0,
                label: "image #4",
                thumb: "http://36.media.tumblr.com/d226f2dc0af8889dedb6ae010d796595/tumblr_nnkkezir8Z1topm99o1_1280.jpg"
            },
            {
                isBase: 0,
                label: "image #5",
                thumb: "http://stylishhdwallpapers.com/wp-content/uploads/2015/07/Warcraft-Horde-DoomHammer-HD-Wallpaper.jpg"
            }
        ]
    },
    gallery_meow: {
        images: [
            {
                isBase: 1,
                label: "image #5",
                thumb: "http://stylishhdwallpapers.com/wp-content/uploads/2015/07/Warcraft-Horde-DoomHammer-HD-Wallpaper.jpg"
            }
        ]
    },
    gallery_new3: {
        placeholder: {
            label: "image #1",
            thumb: "http://iqlab.ua/test/gallery/placeholder.jpg"
        }
    }
};

var galleryData3 = {
    videos: [
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://iqlab.ua/test/gallery/video_thumb1.jpg"
        },
        {
            url: "http://vimeo.com/129766340",
            thumb: "http://iqlab.ua/test/gallery/video_thumb2.jpg"
        }
    ],
    gallery_main: {
        images: [
            {
                isBase: false,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb4_000.jpg"
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
            }
        ]
    },
    gallery_new: {
        images: [
            {
                isBase: false,
                label: "image #1",
                thumb: "http://iqlab.ua/test/gallery/thumb1.png"
            },
            {
                isBase: false,
                label: "image #2",
                thumb: "http://iqlab.ua/test/gallery/thumb2.png"
            }
        ]
    },
    gallery_new2: {
        placeholder: {
            label: "image #1",
            thumb: "http://iqlab.ua/test/gallery/placeholder.jpg"
        }
    }
};

var ONEPICA = ONEPICA || {};

(function (ONEPICA) {
    'use strict';
    ONEPICA.Gallery = ONEPICA.Gallery || {};

    var defaults = {

            isQuickView: false,

            mainImagesSetName: 'gallery_main',
            videosDataName: 'videos',
            noImageUrl: "https://daniellereviewsmovingpictures.files.wordpress.com/2015/06/11141364_680145855424272_7135930776227614345_o.jpg",

            baseParams: {
                mainImageWrapperClass: 'js-main-image-wrapper',
                mainImageClass: 'js-main-image',
                mainImageID: 'jsMainImage',
                thumbContainerClass: 'product-view-image-thumbs',
                thumbContainerId: 'thumbsContainer',
                thumbItemClass: 'product-image-thumb',
                thumbLinkClass: 'js-thumb-link',
                thumbImgClass: 'js-thumb-image',
                thumbVideoItemClass: 'product-video-thumb',
                thumbVideoElementClass: 'product-video-link',
                thumbVideoContainer: 'product-video-thumbs-container',
                thumbClass: 'thumb-element',
                loaderClass: 'js-loader',
                loaderUrl: 'https://www.myaultcare.com/image/loading.gif',
                popupClass: 'fancybox-media js-popup',
                activeThumbClass: 'active-thumb',
                hiddenClass: 'is-hidden',
                thumbsTitleClass: 'product-view-subtitle',
                thumbsTitleText: 'More views',
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
        },
        params,
        currentImagesSetName,
        currentImagesInfo,
        $galleryContainer,
        startImage,
        isZoomActive = false,
        isMobile,
        currentThumbIndex,
        mobileSlider,
        mobileSliderEnabled,
        mainImageExists,
        thumbsGalleryExists,
        videoGalleryExists,
        noImageIndex,
        galleryData,
        $;

    function sortImages(imagesSet) {
        if (typeof galleryData[imagesSet].images === 'undefined') {
            return;
        }
        for (var i = 0; i < galleryData[imagesSet].images.length; i++) {
            if (galleryData[imagesSet].images[i].isBase) {
                Array.prototype.unshift.apply(galleryData[imagesSet].images, galleryData[imagesSet].images.splice(i, galleryData[imagesSet].images.length));
            }
        }
    }

    /**
     * Removes generated gallery
     */

    function removeGallery() {
        $galleryContainer.empty();

        mainImageExists = false;
        thumbsGalleryExists = false;
        videoGalleryExists = false;
        mobileSliderEnabled = false;
        currentThumbIndex = 0;
        noImageIndex = 'undefined';

        removeZoom();
    }


    /**
     * Generates gallery
     * @param {string} name - a key of an object with images and options
     *
     */

    function generateGallery(name) {

        currentImagesSetName = name;

        if (typeof galleryData[name].placeholder !== 'undefined') {
            generatePlaceholder(name);
            generateVideoThumbs();
            return;
        }

        currentImagesInfo = galleryData[name].images;

        generateMainImage(currentImagesInfo);
        generateGalleryThumbs(currentImagesInfo);

        if (isMobile && thumbsGalleryExists) {
            hideMainImage();
        }
    }

    function hideMainImage() {
        $('.' + params.baseParams.mainImageWrapperClass).addClass(params.baseParams.hiddenClass);
    }

    function showMainImage() {
        $('.' + params.baseParams.mainImageWrapperClass).removeClass(params.baseParams.hiddenClass);
    }

    function addLoader() {
        var loader =
            $('<div/>')
                .addClass(params.baseParams.loaderClass)
                .appendTo($('.' + params.baseParams.mainImageWrapperClass));
        $('<span/>')
            .attr('src', params.baseParams.loaderUrl)
            .appendTo(loader);
    }

    function showLoader() {
        $('.' + params.baseParams.loaderClass).show();
    }

    function hideLoader() {
        $('.' + params.baseParams.loaderClass).hide();
    }

    function getMainImageDimensions() {
        var mainImage = $('.' + params.baseParams.mainImageWrapperClass);
        return {
            width: mainImage.width(),
            height: mainImage.width()
        }
    }

    /**
     * Finds base image basing on images object
     *
     * @param {object} imagesData - an object with images
     * @param {string} imagesData.label - image label
     * @param {string} imagesData.thumb - image src
     * @param {bool} imagesData.isBase - is image a base image flag
     *
     */
    function findBaseImage(imagesData) {
        if (typeof imagesData === 'undefined') {
            return {
                index: 0,
                label: galleryData[currentImagesSetName].placeholder.label,
                thumb: galleryData[currentImagesSetName].placeholder.thumb
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
    }

    /**
     * Creates placeholder of an image basing on placeholder key name
     *
     * @param {string} placeholderData - a key for placeholder info
     * @param {string} placeholderData.placeholder.thumb - an src to placeholder image
     *
     */
    function generatePlaceholder(placeholderData) {
        if (mainImageExists) {
            return;
        }
        var el = $('<img />'),
            wrapper = $('<div>')
                .addClass(params.baseParams.mainImageWrapperClass)
                .appendTo($galleryContainer),
            baseImageDimensions = getMainImageDimensions();

        el
            .addClass(params.baseParams.mainImageClass)
            .attr('src', galleryData[placeholderData].placeholder.thumb)
            .appendTo(wrapper)
            .css({opacity: 0})
            .on('error', function () {
                el.attr('src', params.noImageUrl)
            })
            .on('load', function () {
                el.css(
                    {
                        opacity: 1,
                        width: 'auto',
                        height: 'auto'
                    }
                );
                hideLoader();
            });
        el.css(
            {
                width: baseImageDimensions.width,
                height: baseImageDimensions.height
            }
        );
        addLoader();
        showLoader();
        mainImageExists = true;
    }

    /**
     * Generates Main Image object basing on images object
     * @param {object} imagesData - an object with images
     *
     */
    function generateMainImage(imagesData) {
        if (mainImageExists) {
            return;
        }
        var el = $('<img />'),
            baseImageWrapper = $('<div>')
                .addClass(params.baseParams.mainImageWrapperClass)
                .appendTo($galleryContainer),
            baseImageData = findBaseImage(imagesData),
            baseImageDimensions = getMainImageDimensions();

        el
            .addClass(params.baseParams.mainImageClass)
            .attr('src', baseImageData.src)
            .attr('label', baseImageData.label)
            .attr('id', params.baseParams.mainImageID)
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
                hideLoader();
            })
            .on('error', function () {
                el
                    .attr('src', params.noImageUrl)
                    .attr('data-zoom-image', params.noImageUrl);
                noImageIndex = el.attr('data-image-index');
            });
        addLoader();

        el.css(
            {
                width: baseImageDimensions.width,
                height: baseImageDimensions.height
            }
        );
        makeThumbActive($('.' + params.baseParams.mainImageClass));

        mainImageExists = true;

        if (isMobile && thumbsGalleryExists) {
            hideLoader();
            baseImageWrapper.hide();
        } else {
            showLoader();
            baseImageWrapper.show();
        }
        getMainImageDimensions();
    }

    /**
     * Generates Video thumbs container
     *
     */
    function findOrCreateVideoThumbsContainer() {
        if (isMobile || !thumbsGalleryExists) {
            return $('<ul/>')
                .addClass(params.baseParams.thumbContainerClass)
                .appendTo($galleryContainer);
        }
        return $galleryContainer.find('.' + params.baseParams.thumbContainerClass);
    }

    function createThumbsTitle() {
        return $('<h3/>')
            .addClass(params.baseParams.thumbsTitleClass)
            .text(params.baseParams.thumbsTitleText);
    }

    /**
     * Generates Video thumbs basing on videos object
     *
     */
    function generateVideoThumbs(list) {
        if (videoGalleryExists || params.isQuickView) {
            return;
        }

        if (typeof galleryData[params.videosDataName] === 'undefined') {
            videoGalleryExists = false;
            return;
        }

        var videoData = galleryData[params.videosDataName],
            container = list ? list : findOrCreateVideoThumbsContainer();

        $.each(videoData, function (videoIndex) {
                var li = $('<li/>')
                        .addClass(params.baseParams.thumbItemClass)
                        .addClass(params.baseParams.thumbVideoItemClass)
                        .appendTo(container),
                    span = $('<span/>')
                        .addClass(params.baseParams.thumbClass)
                        .addClass(params.baseParams.thumbVideoElementClass)
                        .addClass(params.baseParams.popupClass)
                        .attr('data-fancybox-href', videoData[videoIndex].url)
                        .appendTo(li),
                    img = $('<img/>')
                        .addClass(params.baseParams.thumbImgClass)
                        .attr('src', videoData[videoIndex].thumb)
                        .appendTo(span);
            }
        );
        videoGalleryExists = true;
    }

    function createThumbsContainer(id, classname) {
        return $('<ul/>')
            .addClass(classname ? classname : params.baseParams.thumbContainerClass)
            .attr('id', id ? id : params.baseParams.thumbContainerId);
    }

    /**
     * Generates images thumbs from images object
     * @param {object} imagesData - an object with images
     * @param {string} imagesData.thumb - an url of image
     * @param {string} imagesData.label - a label of image
     *
     */
    function generateGalleryThumbs(imagesData) {
        if (thumbsGalleryExists) {
            return;
        }
        if (imagesData.length <= 1 || thumbsGalleryExists) {
            generateVideoThumbs();
            thumbsGalleryExists = false;
            return thumbsGalleryExists;
        }
        var container = createThumbsContainer(),
            title = createThumbsTitle();

        container.appendTo($galleryContainer);
        title.insertBefore(container);

        //TODO: extract elements creation

        $.each(imagesData, function (imageIndex) {
            var li = $('<li/>')
                    .addClass(params.baseParams.thumbItemClass)
                    .appendTo(container),
                a = $('<a/>')
                    .addClass(params.baseParams.thumbLinkClass + ' ' + params.baseParams.thumbClass)
                    .attr('data-image-index', imageIndex)
                    .attr('href', '#')
                    .attr('data-zoom-image', imagesData[imageIndex].thumb)
                    .attr('data-image', imagesData[imageIndex].thumb)

                    .on('click', function (e) {
                        e.preventDefault();
                        switchGalleryImage($(this).attr('data-image-index'));
                        makeThumbActive($(this));
                        if (mobileSliderEnabled) {
                            mobileSlider.goToSlide($(this).attr('data-image-index'));
                        }
                    })
                    .appendTo(li),
                img = $('<img/>')
                    .addClass(params.baseParams.thumbImgClass)
                    .attr('src', imagesData[imageIndex].thumb)
                    .on('error', function () {
                        img.attr('src', params.noImageUrl);
                        img
                            .parent()
                            .attr('data-zoom-image', params.noImageUrl)
                            .attr('data-image', params.noImageUrl);
                        noImageIndex = img.parent().attr('data-image-index');
                    })
                    .attr('label', '' + imagesData[imageIndex].label)
                    .appendTo(a);
        });
        makeThumbActive($('.' + params.baseParams.mainImageClass));

        generateVideoThumbs(container);
        generateSliderElements(imagesData);

        thumbsGalleryExists = true;
    }

    /**
     * Generates images thumbs from images object
     *
     * @param {object} imagesData - an object with images
     * @param {string} imagesData.thumb - an url of image
     * @param {string} imagesData.label - a label of image
     *
     */
    function generateSliderElements(imagesData) {
        if (thumbsGalleryExists) {
            return;
        }
        var container = createThumbsContainer('mobileSlider', 'js-mobile-slider');
        container.prependTo($galleryContainer);

        //TODO: extract elements creation

        $.each(imagesData, function (imageIndex) {
            var div = $('<div/>')
                    .addClass(params.baseParams.thumbItemClass)
                    .attr('data-image-index', imageIndex)
                    .appendTo(container),
                img = $('<img/>')
                    .attr('src', imagesData[imageIndex].thumb)
                    .on('error', function () {
                        img.attr('src', params.noImageUrl);
                        img
                            .parent()
                            .attr('data-zoom-image', params.noImageUrl)
                            .attr('data-image', params.noImageUrl)
                    })
                    .attr('label', '' + imagesData[imageIndex].label)
                    .appendTo(div);
        });
    }

    function initZoomResize() {
        var resizeInProgress = false,
            zoomExists = true,
            currentWindowWidth = window.innerWidth;

        $(window).resize(function () {
            if (window.innerWidth == currentWindowWidth) {
                return;
            }

            currentWindowWidth = window.innerWidth;
            if (resizeInProgress === false) {
                if (zoomExists) {
                    removeZoom();
                    showLoader();
                    zoomExists = false;
                    setTimeout(checkResizeProgress, params.baseParams.resizeTimeout);
                }
            }
            resizeInProgress = true;
        });

        function checkResizeProgress() {
            if (resizeInProgress) {
                setTimeout(checkResizeProgress, params.baseParams.resizeTimeout);
                resizeInProgress = false;
            } else {
                hideLoader();
                addZoom();
                zoomExists = true;
            }
        }
    }

    /**
     * Adds mobile slider basing on images thumbs
     *
     */
    function addMobileSlider() {
        if (!isMobile || !thumbsGalleryExists) {
            return;
        }

        mobileSlider = $('#mobileSlider').bxSlider({
            pager: params.sliderParams.pager,
            startSlide: currentThumbIndex,
            onSlideNext: function (currentSlide) {
                currentThumbIndex = currentSlide.attr('data-image-index');
                switchGalleryImage(currentThumbIndex);
                makeThumbActive(currentSlide);
            },
            onSlidePrev: function (currentSlide) {
                currentThumbIndex = currentSlide.attr('data-image-index');
                switchGalleryImage(currentThumbIndex);
                makeThumbActive(currentSlide);
            }
        });
        mobileSliderEnabled = true;
    }

    /**
     * Removes mobile slider
     *
     */
    function removeMobileSlider() {
        if (mobileSliderEnabled) {
            mobileSlider.destroySlider();
            mobileSliderEnabled = false;
        }
    }

    /**
     * Switches gallery image basing on index of a new image, emulates zoom functionality of image switch
     * @param {string} index - an index of new image to switch to
     *
     */
    function switchGalleryImage(index) {
        var mainImage = $galleryContainer.find($('.' + params.baseParams.mainImageClass)),
            newImage = $('.' + params.baseParams.thumbContainerClass).find("[data-image-index='" + index + "']");

        currentThumbIndex = index;
        mainImage.attr('data-image-index', index);
        mainImage.attr('data-zoom-image', $(newImage).attr('data-zoom-image'));
        mainImage.attr('src', $(newImage).attr('data-zoom-image'));
        mainImage.attr('label', $(newImage).find('img').attr('label'));
    }

    /**
     * Makes gallery thumb active basing on index of a new image, emulates zoom functionality of image switch
     * @param {string} thumb - an index of new image to switch to
     *
     */
    function makeThumbActive(thumb) {
        var index = $(thumb).attr('data-image-index'),
            $links = $('.' + params.baseParams.thumbContainerClass);
        $links
            .find('.' + params.baseParams.thumbLinkClass)
            .removeClass(params.baseParams.activeThumbClass);
        removeZoom();

        $links
            .find("[data-image-index='" + index + "']")
            .addClass(params.baseParams.activeThumbClass);
        addZoom();
    }

    /**
     * Adds image zoom
     *
     * @param {string} [width] - width of image, to set zoom window width
     * @param {string} [height] - height of image, to set zoom window height
     *
     */
    function addZoom(width, height) {
        if (isMobile || params.isQuickView) {
            return;
        }
        var mainImage = $('#' + params.baseParams.mainImageID);

        if (!isZoomActive && mainImage.attr('data-image-index') !== noImageIndex) {
            mainImage.elevateZoom($.extend({}, params.zoomParams, {
                zoomWindowWidth: width ? width : mainImage.width(),
                zoomWindowHeight: height ? height : mainImage.height()
            }));
            isZoomActive = true;
        }
    }

    /**
     * Removes image zoom
     *
     */
    function removeZoom() {
        if (!isZoomActive) {
            return;
        }
        var image = $('.' + params.baseParams.mainImageClass);
        $('.zoomContainer').remove();
        image.removeData('elevateZoom');
        image.removeData('zoomImage');
        isZoomActive = false;
    }

    /**
     * Initialization of desktop view
     */
    function initDesktop() {
        isMobile = false;

        if (mainImageExists) {
            showMainImage();
        }

        generateGallery(currentImagesSetName);
        if (mobileSliderEnabled) {
            removeMobileSlider();
        }
    }

    /**
     * Initialization of mobile view
     *
     */
    function initMobile() {
        isMobile = true;

        generateGallery(currentImagesSetName);

        removeZoom();

        //hides main image only if there more than one gallery image
        if (thumbsGalleryExists) {
            hideMainImage();
        }

        if (!mobileSliderEnabled && thumbsGalleryExists) {
            addMobileSlider();
        }
    }

    ONEPICA.Gallery.init = function (imagesData, containerSelector, settings) {
        $ = jQuery.noConflict();

        galleryData = imagesData;

        params = $.extend(true, {}, defaults, settings);
        currentImagesSetName = params.mainImagesSetName;
        currentImagesInfo = galleryData[currentImagesSetName].images;
        $galleryContainer = $(containerSelector);
        startImage = findBaseImage(galleryData[currentImagesSetName].images);
        currentThumbIndex = startImage.index;

        sortImages(params.mainImagesSetName);

        if (params.isQuickView) {
            initDesktop();
        }
        initZoomResize();

        $(window).on("mediaTD", initDesktop);
        $(window).on("mediaM", initMobile);

    };
    ONEPICA.Gallery.switchGalleryView = function (galleryKey) {
        removeGallery();
        sortImages(galleryKey);
        generateGallery(galleryKey);
        if (isMobile && !mobileSliderEnabled) {
            addMobileSlider();
        }
        currentImagesInfo = galleryKey;
    };
    //TODO: temporary


})(ONEPICA);
