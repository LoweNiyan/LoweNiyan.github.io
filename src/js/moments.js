// ── 配置 ──
const SCROLL_SPEED = 3;

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

// ── 弹窗（兼容文章和笔记）──
function openModal(entry) {
    if (entry.image) {
        $('#modal_img').attr('src', entry.image).addClass('has-img');
    } else {
        $('#modal_img').removeClass('has-img').attr('src', '');
    }

    if (entry.type === 'note') {
        $('#modal_title').text('');
        $('#modal_body').html(entry.content);
        $('#modal_link').hide();
        $('#modal_tags').empty();
    } else {
        // 文章
        $('#modal_title').text(entry.title);
        $('#modal_body').html((entry.content || entry.summary || '').replace(/\n/g, '<br>'));
        if (entry.url) {
            $('#modal_link').attr('href', entry.url).show();
        } else {
            $('#modal_link').hide();
        }
        // 标签
        var tagsHtml = '';
        if (entry.tags && entry.tags.length) {
            tagsHtml = entry.tags.map(function (t) { return '<span class="modal-tag">' + t + '</span>'; }).join('');
        }
        $('#modal_tags').html(tagsHtml);
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
        'box-shadow': '0 0 0 1px #ffffff80, 0 0 5px #ffffff60, 0 0 10px #ffffff40, 0 0 50px #ffffff37',
        'color': '#ffffff80'
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

            $item.attr('data-entry-id', entry.id);

            $item.on('click', function () {
                var targetId = $(this).attr('data-entry-id');
                var card = document.querySelector('[data-entry-id="' + targetId + '"]');
                if (card) scrollToCard(card);
                closeIndexOverlay();
            });

            $list.append($item);
        });
    });
}

// ── 页面入口 ──
$(document).ready(function () {
    // 从注入的 JSON 读取数据（扁平数组，已排序）
    var dataEl = document.getElementById('moments-data');
    if (!dataEl) {
        console.error('moments-data not found');
        return;
    }
    var allLogs;
    try {
        allLogs = JSON.parse(dataEl.textContent);
    } catch (e) {
        console.error('Failed to parse moments-data', e);
        return;
    }

    // 建立 ID → entry 映射，供卡片点击查找
    var entryMap = new Map(allLogs.map(function (e) { return [e.id, e]; }));

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

    // 构建索引
    buildIndex(allLogs);

    // 如果 URL hash 是 #index，自动打开索引
    if (window.location.hash === '#index') {
        setTimeout(function () {
            openIndexOverlay();
        }, 100);
    }

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

    // 卡片点击（统一处理文章和笔记）
    $('#log_container').on('click', '.log-card-article, .log-card-note', function () {
        var entry = entryMap.get($(this).attr('data-entry-id'));
        if (entry) openModal(entry);
    });

    // 弹窗关闭
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
