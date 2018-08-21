// ==UserScript==
// @name         8Comic-FullScreenViewer
// @version      1.1
// @author       MrDaDaDo
// @include      /^https:\/\/v\.comicbus\.com\/online\/(comic|manga)\-(\d)+\.html\?ch=(\d)+(\-(\d)+)?/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    var $ = window.jQuery
    var $img = $('#TheImg');
    var $td = $img.parent();
    var isFullScreen = false;
    $img.css('object-fit','contain');
    $img.on('click',null,function() { jn(); });
    $img.on('contextmenu',null,function() { unFullScreen(); });
    var fullScreen = function() {
        $td.css('position', 'fixed');
        $td.css('top', '0px');
        $td.css('left', '0px');
        $td.css('width', '100%');
        $td.css('height', '100%');
        $td.css('background-color', '#666666');
        $img.css('width','100%');
        $img.css('height','100%');
        $img.css('width','100%');
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
        $img.css('width','');
        isFullScreen = false;
    };
    var changeFullScreen = function() {
        if(isFullScreen) {
            unFullScreen();
        } else {
            fullScreen();
        }
    };
    fullScreen();
})();