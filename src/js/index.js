import {printer} from './script.js';

// 别看了，videcoding 的垃圾代码(〃ﾉωﾉ)

// ── Persistent state (survives SPA navigations) ──
let printerHandle = null;
let printerTimeout = null;
let closeTimer = null;

// ── One-time delegated event bindings (runs once; document persists) ──
$(document).on('click', '#more_btn', function() {
  const moreContainer = $('#more_container');
  const btn = $('#more_btn');
  const btnRect = this.getBoundingClientRect();
  const x = btnRect.left + btnRect.width / 2;
  const y = btnRect.top + btnRect.height / 2;
  const MORE_INFO_TEXT = "你好，我或许是洛濔吧，这里大概就是我的个人主页owo。";
  const MORE_INFO_ELEMENT = $('#more_info_content');

  clearTimeout(closeTimer);

  if (moreContainer.hasClass('active')) {
    $('a.more_btn').css('box-shadow','0 0 0 1px #ffffff80, 0 0 5px  #ffffff60, 0 0 10px #ffffff40, 0 0 50px #ffffff37');
    if (printerHandle) printerHandle.stop();
    clearTimeout(printerTimeout);

    moreContainer.css({
      'transition': 'clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
      'clip-path': `circle(0% at ${x}px ${y}px)`
    });
    btn.text('more↗');
    btn.css({'width':'146px','color':'#ffffff80'});

    closeTimer = setTimeout(() => {
      if (printerHandle) {
        printerHandle.clear();
        printerHandle = null;
      }
    }, 600);

  } else {
    $('a.more_btn').css('box-shadow','none');
    moreContainer.css({
      'transition': 'clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
      'clip-path': `circle(150% at ${x}px ${y}px)`
    });
    btn.text('less↗');
    btn.css({'width':'127px','color':'#000'});

    if (printerHandle && !printerHandle.isDone()) {
      printerTimeout = setTimeout(() => {
        printerHandle.resume();
      }, 1500);
    } else {
      printerTimeout = setTimeout(() => {
        printerHandle = printer(MORE_INFO_TEXT, MORE_INFO_ELEMENT, 50);
      }, 1500);
    }
  }

  moreContainer.toggleClass('active');
});

// ── Per-navigation DOM init ──
document.addEventListener('astro:page-load', function() {
  const isMobile = window.innerWidth < 768;
  const baseRight = isMobile ? 0 : 600;
  const step = isMobile ? 24 : 50;
  $('.hello ul li').each(function(index) {
    const right = baseRight + (index * step);
    const blur = blurValues[index] !== undefined ? blurValues[index] : 5;
    $(this).css({
      'right': right + 'px',
      'filter': 'blur(' + blur + 'px)'
    });
  });
});

const blurValues = [5, 4, 3, 2, 0, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const overallIntensity = 0.3;
const maxParallaxFactor = (-1 / 10) * overallIntensity;
const baseParallaxFactor = (-1 / 100) * overallIntensity;
const specialSpanFactor = (-1 / 200) * overallIntensity;

$(window).off('mousemove.indexParallax').on('mousemove.indexParallax', function(e) {
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
