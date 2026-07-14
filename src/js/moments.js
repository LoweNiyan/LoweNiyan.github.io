// ── 配置 ──
const SCROLL_SPEED = 3;

import {articleUrls} from '../content/logs.js'
import {notes} from '../content/logs.js'

// ── 工具函数 ──
function formatDate(dateStr) {
    var parts = dateStr.split('-');
    return parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日';
}

function groupByDate(logList) {
    var groups = new Map();
    logList.forEach(function (log) {
        if (!groups.has(log.date)) groups.set(log.date, []);
        groups.get(log.date).push(log);
    });
    return groups;
}

// ── 从博客页面获取文章元数据 ──
var DEFAULT_IMAGE = '../../img/logimg/test_image.jpg';

function fetchArticleMeta(url) {
    return fetch(url)
        .then(function (r) {
            var lastMod = r.headers.get('Last-Modified');
            return r.text().then(function (html) { return { html: html, lastMod: lastMod }; });
        })
        .then(function (result) {
            var html = result.html;
            var lastMod = result.lastMod;

            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var raw = doc.getElementById('article-meta').textContent;
            var meta = JSON.parse(raw);
            meta.type = 'article';
            meta.url = url;

            // 无日期则从 Last-Modified 获取
            if (!meta.date && lastMod) {
                var d = new Date(lastMod);
                meta.date = d.getFullYear() + '-' +
                    String(d.getMonth() + 1).padStart(2, '0') + '-' +
                    String(d.getDate()).padStart(2, '0');
                meta.time = String(d.getHours()).padStart(2, '0') + ':' +
                    String(d.getMinutes()).padStart(2, '0');
            }

            // 无封面图则用默认图
            if (!meta.image) meta.image = DEFAULT_IMAGE;

            var bodyEl = doc.querySelector('.blog-body');
            if (bodyEl) {
                meta.content = bodyEl.innerHTML
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<[^>]+>/g, '')
                    .trim();
            }
            return meta;
        })
        .catch(function () { return null; });
}

// ── 卡片渲染 ──
function renderNoteCard(entry) {
    var imgHtml = entry.image
        ? '<img class="note-img" src="' + entry.image + '" alt="">'
        : '';
    var card = $('<div class="log-card-note">' + imgHtml
        + '<time>' + entry.time + '</time><p>' + entry.content + '</p></div>');
    card.data('entry', entry);
    return card;
}

function renderArticleCard(entry) {
    var imgHtml = entry.image
        ? '<img src="' + entry.image + '" alt="">'
        : '<span class="card-img-placeholder">+</span>';

    var card = $('<div class="log-card-article"><div class="card-img-wrap">' + imgHtml + '</div>'
        + '<div class="card-title">' + entry.title + '</div>'
        + '<div class="card-summary">' + entry.summary + '</div>'
        + '<div class="card-time">' + entry.time + '</div></div>');

    card.data('article', entry);
    card.data('entry', entry);
    return card;
}

// ── 弹窗（兼容文章和笔记）──
function openModal(entry) {
    if (entry.image) {
        $('#modal_img').attr('src', entry.image).addClass('has-img');
    } else {
        $('#modal_img').removeClass('has-img').attr('src', '');
    }

    if (entry.type === 'note') {
        // 笔记：无标题，无原文链接
        $('#modal_title').text('');
        $('#modal_body').html(entry.content);
        $('#modal_link').hide();
    } else {
        // 文章
        $('#modal_title').text(entry.title);
        $('#modal_body').html((entry.content || '').replace(/\n/g, '<br>'));
        if (entry.url) {
            $('#modal_link').attr('href', entry.url).show();
        } else {
            $('#modal_link').hide();
        }
    }

    var timeStr = formatDate(entry.date) + '  ' + entry.time;
    if (entry.author) timeStr += '  ' + entry.author;
    $('#modal_time').text(timeStr);

    $('#modal').addClass('active');
    $('#viewport_container')[0].scrollTo({top: window.innerHeight, behavior: 'smooth'});
}

function closeModal() {
    $('#modal').removeClass('active');
    $('#viewport_container')[0].scrollTo({top: 0, behavior: 'smooth'});
}

// ── 滚动到卡片 ──
function scrollToCard(cardEl) {
    var vp = $('.log-viewport')[0];
    var rect = cardEl.getBoundingClientRect();
    var bodyScroll = vp.scrollLeft;
    var cardCenterX = rect.left + rect.width / 2 + bodyScroll;
    var targetX = cardCenterX - window.innerWidth / 2;
    var maxScroll = vp.scrollWidth - vp.clientWidth;

    vp.scrollTo({
        left: Math.max(0, Math.min(targetX, maxScroll)),
        behavior: 'smooth'
    });
}

// ── 索引弹窗（clip-path circle 辐射动画）──
function getIndexBtnCenter() {
    var btn = $('#index_btn')[0];
    var rect = btn.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function openIndexOverlay() {
    var $overlay = $('#index_overlay');
    var center = getIndexBtnCenter();
    $overlay.css({
        transition: 'clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
        'clip-path': 'circle(150% at ' + center.x + 'px ' + center.y + 'px)'
    });
    $overlay.addClass('active');
    $('#index_btn').css({ 'box-shadow': 'none', 'color': '#000' }).text('close');
}

function closeIndexOverlay() {
    var $overlay = $('#index_overlay');
    var center = getIndexBtnCenter();
    $overlay.css({
        transition: 'clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
        'clip-path': 'circle(0% at ' + center.x + 'px ' + center.y + 'px)'
    });
    $overlay.removeClass('active');
    $('#index_btn').css({
        'box-shadow': '0 0 0 1px #fff, 0 0 5px #ffffffcc, 0 0 10px #ffffff80, 0 0 50px #ffffff37',
        'color': 'inherit'
    }).text('index');
}

function buildIndex(logs) {
    var $list = $('#index_list').empty();
    var groups = groupByDate(logs);
    var sortedDates = Array.from(groups.keys()).sort(function (a, b) { return b.localeCompare(a); });

    sortedDates.forEach(function (date) {
        $list.append('<div class="index-date">' + formatDate(date) + '</div>');

        groups.get(date).forEach(function (entry) {
            var typeClass = 'index-badge-' + (entry.type === 'article' ? 'article' : 'note');
            var badgeText = entry.type === 'article' ? 'A' : 'N';
            var text = entry.title || entry.content;
            if (text.length > 30) text = text.substring(0, 30) + '…';

            var $item = $('<div class="index-item">'
                + '<span class="index-badge ' + typeClass + '">' + badgeText + '</span>'
                + '<span class="index-item-text">' + text + '</span>'
                + '<span class="index-item-time">' + entry.time + '</span>'
                + '</div>');

            $item.data('entry', entry);

            $item.on('click', function () {
                var targetEntry = $(this).data('entry');
                var cards = document.querySelectorAll('.log-card-note, .log-card-article');
                for (var i = 0; i < cards.length; i++) {
                    if ($(cards[i]).data('entry') === targetEntry) {
                        scrollToCard(cards[i]);
                        break;
                    }
                }
                closeIndexOverlay();
            });

            $list.append($item);
        });
    });
}

// ── 页面入口 ──
$(document).ready(function () {
    var hintTimer;
    var $hint = $('.kb-hint');

    function hideHintTemporarily() {
        $hint.css('opacity', 0.2);
        clearTimeout(hintTimer);
        hintTimer = setTimeout(function () {
            $hint.css('opacity', 1);
        }, 1000);
    }

    // 初始化索引弹窗 clip-path
    (function () {
        var center = getIndexBtnCenter();
        $('#index_overlay').css('clip-path', 'circle(0% at ' + center.x + 'px ' + center.y + 'px)');
    })();

    // 获取所有日志数据
    var urls = articleUrls || [];
    var fetches = urls.map(function (url) { return fetchArticleMeta(url); });

    Promise.all(fetches).then(function (articleData) {
        articleData = articleData.filter(function (a) { return a !== null; });
        var allLogs = articleData.concat(notes || []);
        allLogs.sort(function (a, b) {
            var da = a.date + ' ' + (a.time || '00:00');
            var db = b.date + ' ' + (b.time || '00:00');
            return db.localeCompare(da);
        });

        // 渲染卡片
        var groups = groupByDate(allLogs);
        var sortedDates = Array.from(groups.keys()).sort(function (a, b) { return b.localeCompare(a); });
        var container = $('#log_container');

        sortedDates.forEach(function (date) {
            container.append('<div class="date-marker"><span>' + formatDate(date) + '</span></div>');

            groups.get(date).forEach(function (entry) {
                if (entry.type === 'article') {
                    container.append(renderArticleCard(entry));
                } else {
                    container.append(renderNoteCard(entry));
                }
            });
        });

        // 构建索引
        buildIndex(allLogs);
    });

    // 横向滚轮（弹窗打开时不拦截）
    $('.log-viewport')[0].addEventListener('wheel', function (e) {
        if ($('#modal').hasClass('active') || $('#index_overlay').hasClass('active')) return;
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY * SCROLL_SPEED;
            hideHintTemporarily();
        }
    }, { passive: false });
    // ── 事件绑定 ──

    // 文章卡片点击
    $('#log_container').on('click', '.log-card-article', function () {
        var article = $(this).data('article');
        if (article) openModal(article);
    });

    // 笔记卡片点击
    $('#log_container').on('click', '.log-card-note', function () {
        var note = $(this).data('entry');
        if (note) openModal(note);
    });

    // 文章弹窗关闭
    $('#modal').on('click', function (e) {
        if (e.target === this) closeModal();
    });
    $('.modal-close').on('click', closeModal);

    // 阅读原文 hover → 面板下半红光
    $('#modal_link').on('mouseenter', function () {
        $('.modal-panel').addClass('glow');
    }).on('mouseleave', function () {
        $('.modal-panel').removeClass('glow');
    });

    // 索引按钮
    $('#index_btn').on('click', function () {
        if ($('#index_overlay').hasClass('active')) {
            closeIndexOverlay();
        } else {
            openIndexOverlay();
        }
    });

    // 索引弹窗关闭
    $('#index_overlay').on('click', function (e) {
        if (e.target === this) closeIndexOverlay();
    });
    $('.index-close').on('click', closeIndexOverlay);

    // 键盘快捷键
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            if ($('#index_overlay').hasClass('active')) {
                closeIndexOverlay();
                return;
            }
            if ($('#modal').hasClass('active')) {
                closeModal();
                return;
            }
            return;
        }

        if ($('#modal').hasClass('active')) return;

        if ((e.key === 'i' || e.key === 'I') && !e.metaKey && !e.ctrlKey) {
            if ($('#index_overlay').hasClass('active')) {
                closeIndexOverlay();
            } else {
                openIndexOverlay();
            }
            return;
        }

        if ($('#index_overlay').hasClass('active')) return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();

            if ($('#modal').hasClass('active') || $('#index_overlay').hasClass('active')) return;

            var vp = $('.log-viewport')[0];
            var delta = e.key === 'ArrowRight' ? (100 * SCROLL_SPEED) : -(100 * SCROLL_SPEED);
            var maxScroll = vp.scrollWidth - vp.clientWidth;

            vp.scrollLeft = Math.max(0, Math.min(vp.scrollLeft + delta, maxScroll));

            hideHintTemporarily();
        }
    });
});
