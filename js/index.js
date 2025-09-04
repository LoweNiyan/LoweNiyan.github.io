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

  const overallIntensity = 0.3; // 1.0是默认强度

  const maxParallaxFactor = (-1 / 10) * overallIntensity; // For blur 5
  const baseParallaxFactor = (-1 / 100) * overallIntensity; // For blur 0
  const specialSpanFactor = (-1 / 200) * overallIntensity; // For the special span, even less movement

  $(window).on('mousemove', function(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const offsetX = mouseX - centerX;
    const offsetY = mouseY - centerY;
    
    $('.hello ul li').each(function(index) {
        const blurValue = blurValues[index] !== undefined ? blurValues[index] : 5;
        
        const li_factor = baseParallaxFactor + (blurValue / 5) * (maxParallaxFactor - baseParallaxFactor);

        const li_translateX = offsetX * li_factor;
        const li_translateY = offsetY * li_factor;
        
        $(this).css({
            '--parallax-x': `${li_translateX}px`,
            '--parallax-y': `${li_translateY}px`
        });

        if (index === 4) {
            const counter_factor = specialSpanFactor - li_factor;
            const span_translateX = offsetX * counter_factor;
            const span_translateY = offsetY * counter_factor;

            $(this).find('span:nth-child(2)').css({
                '--counter-x': `${span_translateX}px`,
                '--counter-y': `${span_translateY}px`
            });
        }
    });
  });
});