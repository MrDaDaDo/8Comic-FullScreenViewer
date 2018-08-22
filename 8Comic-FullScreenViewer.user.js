// ==UserScript==
// @name         8Comic-FullScreenViewer
// @version      1.5
// @author       MrDaDaDo
// @include      /^https:\/\/v\.comicbus\.com\/online\/(comic|manga)(\-|_)(\d)+\.html\?ch=(\d)+(\-(\d)+)?/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    if(window.top != window.self) return;
    var $ = window.jQuery;
    var $img = $('#TheImg');
    var $td = $img.parent();
    var $pageCount = $('<span style="position:absolute; bottom:0px; left:0px; color:#ABCDEF; font-size:18pt;">1/52</span>');
    var isFullScreen = false;
    var $iframeTmp = $("table:first");
    var bookID = location.href.split('-')[1].split('.')[0];
    var bookCh = location.href.split('ch=')[1].split('-')[0];
    var pageAmount = $("#pageindex")[0].childElementCount;
    var currentPageIndex = $("#pageindex")[0].selectedIndex + 1;
    var imageHash = {};
    var preloadAmount = 5;
    $td.html($td.html()); // clear event
    $img = $('#TheImg');
    $td = $img.parent();
    $td.append($pageCount);
    $img.css('object-fit','contain');
    var genPageUrl = function(bookID, bookCh, pageIndex) {
        return `https://v.comicbus.com/online/comic-${bookID}.html?ch=${bookCh}-${pageIndex}`;
    };
    var fullScreen = function() {
        $td.css('position', 'fixed');
        $td.css('top', '0px');
        $td.css('left', '0px');
        $td.css('width', '100%');
        $td.css('height', '100%');
        $td.css('background-color', '#666666');
        $img.css('width','100%');
        $img.css('height','100%');
        isFullScreen = true;
    };
    var unFullScreen = function() {
        $td.css('position', '');
        $td.css('top', '');
        $td.css('left', '');
        $td.css('width', '');
        $td.css('height', '');
        $td.css('background-color', '');
        $img.css('width','');
        $img.css('height','');
        isFullScreen = false;
    };
    var changeFullScreen = function() {
        if(isFullScreen) {
            unFullScreen();
        } else {
            fullScreen();
        }
    };

    var showNextImage = function() {
        if(currentPageIndex >= pageAmount) return;
        currentPageIndex++;
        loadImage();
    };
    var showPrevImage = function() {
        if(currentPageIndex == 1) return;
        currentPageIndex--;
        loadImage();
    };
    var loadImage = function() {
        $img.attr('src', imageHash[currentPageIndex]);
        $pageCount.text(currentPageIndex + "/" + pageAmount);
        setTimeout(function() { preloadImage(); }, 10);
        console.log(imageHash);
    };
    var checkImageSrc = function($_iframe, _pageIndex) {
        let imageSrc = $_iframe.contents().find('#TheImg').attr('src');
        if(imageSrc) {
            imageHash[_pageIndex] =imageSrc;
            $_iframe.attr('src','');
            $_iframe.remove();
        } else {
             setTimeout(function() { checkImageSrc($_iframe, _pageIndex); }, 100);
        }
    };
    var preloadImage = function() {
        if(currentPageIndex >= pageAmount) return;
        for(var pageIndex = currentPageIndex - preloadAmount; pageIndex <= currentPageIndex + preloadAmount; pageIndex++) {
            if(pageIndex <= 0) continue;
            if(pageIndex > pageAmount) continue;
            if(imageHash[pageIndex] != null) continue;
            let $iframe = $('<iframe>');
            $iframe.attr('src',genPageUrl(bookID, bookCh, pageIndex));
            $iframe.attr('width','1px');
            $iframe.attr('height','1px');
            $iframeTmp.append($iframe);
            checkImageSrc($iframe, pageIndex);
        }
    };
    var go = function() {
        for(var pageIndex = 1; pageIndex <= pageAmount; pageIndex++) {
            imageHash[pageIndex] = null;
        }
        imageHash[currentPageIndex] = $img.attr('src');
        loadImage();
    };
    $("body").keydown(function(e) {
        if(e.keyCode == 39) { // right
            showNextImage();
        } else if(e.keyCode == 37) { // left
            showPrevImage();
        }else if(e.keyCode == 27) { // esc
            changeFullScreen();
        }
    });
    fullScreen();
    go();
})();