// $(document).ready(function () {
//     $("body").scroll(function() {
//         if (scrollTop > windowheight * 0.4) {
//             $(".titlebar").css({"margin-top":"0px","box-shadow":"0 2px 10px rgba(0, 0, 0, 0.5)"});
//         }
//         else {
//             $(".titlebar").css({"margin-top":"-48px","box-shadow":"unset"});
//         }
//     }); 
// });

$(document).ready(function() {
  $('#more_btn').click(function() {
    $('#mask').addClass('active');
  });

  const blurValues = [5, 4, 3, 2, 0, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  $('.hello ul li').each(function(index) {
      const right = 600 + (index * 50);
      const blur = blurValues[index] !== undefined ? blurValues[index] : 5;
      $(this).css({
          'right': right + 'px',
          'filter': 'blur(' + blur + 'px)'
      });
  });
});