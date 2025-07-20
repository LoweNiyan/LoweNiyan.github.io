$(document).ready(function () {
    alert("Dev Mode"); 
    $(".hb").click(function () {
        hr = $("body").scrollTop();
        $(".hr").text(hr);
});
});

