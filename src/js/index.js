import {printer} from './script.js';

// 别看了，videcoding 的垃圾代码(〃ﾉωﾉ) 

$(document).ready(function() {
  let printerHandle = null;
  let printerTimeout = null;
  let closeTimer = null;

  $('#more_btn').click(function() {

    const moreContainer = $('#more_container');
    const btn = $('#more_btn');
    const btnRect = this.getBoundingClientRect();
    const x = btnRect.left + btnRect.width / 2;
    const y = btnRect.top + btnRect.height / 2;
    const MORE_INFO_TEXT = "你好，我或许是洛濔吧，这里大概就是我的个人主页owo。";
    const MORE_INFO_ELEMENT = $('#more_info_content');

    // 取消待执行的关闭清理（如果有的话）
    clearTimeout(closeTimer);

    if (moreContainer.hasClass('active')) {
        $('a.more_btn').css('box-shadow','0 0 0 1px #fff, 0 0 5px  #ffffffcc, 0 0 10px #ffffff80, 0 0 50px #ffffff37');
        // === 关闭 ===
        // 暂停打字机但不清理文字（动画期间保留）
        if (printerHandle) printerHandle.stop();
        clearTimeout(printerTimeout);

        moreContainer.css({
            'transition': 'clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
            'clip-path': `circle(0% at ${x}px ${y}px)`
        });
        btn.text('more↗');
        btn.css({'width':'146px','color':'inherit'});

        // 动画结束后才彻底清理文字
        closeTimer = setTimeout(() => {
            if (printerHandle) {
                printerHandle.clear();
                printerHandle = null;
            }
        }, 600);

    } else {
        $('a.more_btn').css('box-shadow','none');
        // === 打开 ===
        moreContainer.css({
            'transition': 'clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
            'clip-path': `circle(150% at ${x}px ${y}px)`
        });
        btn.text('less↗');
        btn.css({'width':'127px','color':'#000'});

        if (printerHandle && !printerHandle.isDone()) {
            // 之前被打断了，恢复继续打印
            printerTimeout = setTimeout(() => {
                printerHandle.resume();
            }, 1500);
        } else {
            // 全新开始
            printerTimeout = setTimeout(() => {
                printerHandle = printer(MORE_INFO_TEXT, MORE_INFO_ELEMENT, 50);
            }, 1500);
        }
    }

    moreContainer.toggleClass('active');
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