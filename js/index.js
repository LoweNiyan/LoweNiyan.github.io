$(document).ready(function () {
    $("body").scroll(function() {
        if (scrollTop > windowheight * 0.4) {
            $(".titlebar").css({"margin-top":"0px","box-shadow":"0 2px 10px rgba(0, 0, 0, 0.5)"});
        }
        else {
            $(".titlebar").css({"margin-top":"-48px","box-shadow":"unset"});
        }
    }); 
});