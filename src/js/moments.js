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
        $('#modal_title').text(entry.title);
        $('#modal_body').html((entry.content || entry.summary || '').replace(/\n/g, '<br>'));
        if (entry.url) {
            $('#modal_link').attr('href', entry.url).show();
        } else {
            $('#modal_link').hide();
        }
        var tagsHtml = '';
        if (entry.tags && entry.tags.length) {
            tagsHtml = entry.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
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
    history.replaceState(null, '', '/moments');
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

            var tagsHtml = '';
            if (entry.tags && entry.tags.length) {
                tagsHtml = entry.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
            }

            var $item = $('<div class="index-item">'
                + '<span class="index-badge ' + typeClass + '">' + badgeText + '</span>'
                + '<span class="index-item-text-wrap">'
                + '<span class="index-item-text">' + text + '</span>'
                + tagsHtml
                + '</span>'
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

// ── 搜索过滤（AND 多词）──
function filterLogs(logs, typedText, terms) {
    var allTerms = [];
    if (typedText) allTerms.push(typedText);
    allTerms = allTerms.concat(terms);
    if (allTerms.length === 0) return logs;

    return logs.filter(function (entry) {
        return allTerms.every(function (term) {
            var q = term.toLowerCase();
            if (entry.title && entry.title.toLowerCase().indexOf(q) !== -1) return true;
            if (entry.tags) {
                for (var i = 0; i < entry.tags.length; i++) {
                    if (entry.tags[i].toLowerCase().indexOf(q) !== -1) return true;
                }
            }
            if (entry.type === 'note' && entry.content && entry.content.toLowerCase().indexOf(q) !== -1) return true;
            return false;
        });
    });
}

// ── Module-scoped state ──
let hintTimer;
var allLogsData = null;
var searchTerms = [];

function renderSearchChips() {
    var $chips = $('#search_chips').empty();
    searchTerms.forEach(function (term, i) {
        $chips.append('<span class="search-chip">' + term + '<span class="search-chip-remove" data-index="' + i + '">×</span></span>');
    });
    var input = document.getElementById('index_search');
    var typed = input ? input.value : '';
    var filtered = filterLogs(allLogsData, typed, searchTerms);
    buildIndex(filtered);
}

function hideHintTemporarily() {
    $('.kb-hint').css('opacity', 0.2);
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
        $('.kb-hint').css('opacity', 1);
    }, 1000);
}

// ── One-time delegated event bindings (document persists across navigations) ──

// 卡片点击（统一处理文章和笔记）
$(document).on('click', '#log_container .log-card-article, #log_container .log-card-note', function () {
    var entry = window.__entryMap.get($(this).attr('data-entry-id'));
    if (entry) openModal(entry);
});

// 弹窗关闭
$(document).on('click', '#modal', function (e) {
    if (e.target === this) closeModal();
});
$(document).on('click', '.modal-close', closeModal);

// 阅读原文 hover → 面板下半红光
$(document).on('mouseenter', '#modal_link', function () {
    $('.modal-panel').addClass('glow');
}).on('mouseleave', '#modal_link', function () {
    $('.modal-panel').removeClass('glow');
});

// 索引按钮
$(document).on('click', '#index_btn', function () {
    if ($('#index_overlay').hasClass('active')) {
        closeIndexOverlay();
    } else {
        openIndexOverlay();
    }
});

// 索引弹窗关闭
$(document).on('click', '#index_overlay', function (e) {
    if (e.target === this) closeIndexOverlay();
});
$(document).on('click', '.index-close', closeIndexOverlay);

// 搜索：chip 删除
$(document).on('click', '.search-chip-remove', function () {
    var index = parseInt($(this).data('index'));
    if (!isNaN(index)) {
        searchTerms.splice(index, 1);
        renderSearchChips();
    }
});

// moments 页面：标签点击 → 添加为 chip（弹窗中的标签和卡片/索引同一逻辑）
$(document).on('click', '.tag', function (e) {
    e.stopPropagation();
    if (window.location.pathname.replace(/\/$/, '') === '/moments') {
        var tagText = $(this).text();
        if (tagText) {
            searchTerms.length = 0;
            searchTerms.push(tagText);
            var input = document.getElementById('index_search');
            if (input) input.value = '';
            renderSearchChips();
            if (!$('#index_overlay').hasClass('active')) {
                openIndexOverlay();
            }
        }
    }
});

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

    // 输入框聚焦时不触发快捷键
    if ($(e.target).is('input, textarea, [contenteditable]')) return;

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

// ── Per-navigation DOM init ──
document.addEventListener('astro:page-load', function () {
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
    window.__entryMap = new Map(allLogs.map(function (e) { return [e.id, e]; }));

    // 初始化索引弹窗 clip-path
    (function () {
        var center = getIndexBtnCenter();
        $('#index_overlay').css('clip-path', 'circle(0% at ' + center.x + 'px ' + center.y + 'px)');
    })();

    // 保存数据供搜索使用
    allLogsData = allLogs;

    // 重置搜索状态
    searchTerms = [];

    // 从 URL 读取 ?tag= 参数，自动添加为 chip
    var urlParams = new URLSearchParams(window.location.search);
    var tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) {
        searchTerms.push(tagFromUrl);
    }

    // 构建索引（如果 ?tag= 已有值，直接过滤）
    buildIndex(filterLogs(allLogsData, '', searchTerms));

    // 搜索框：实时过滤 + Enter 提交 chip
    var searchInput = document.getElementById('index_search');
    if (searchInput) {
        $(searchInput).off('input.indexSearch').on('input.indexSearch', function () {
            var filtered = filterLogs(allLogsData, this.value, searchTerms);
            buildIndex(filtered);
        });

        $(searchInput).off('keydown.indexSearch').on('keydown.indexSearch', function (e) {
            if (e.key === 'Backspace' && !this.value && searchTerms.length) {
                searchTerms.pop();
                renderSearchChips();
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                var val = this.value.trim();
                if (val && searchTerms.indexOf(val) === -1) {
                    searchTerms.push(val);
                    this.value = '';
                    renderSearchChips();
                }
            }
        });
    }

    // 如果有已有的 chip，重新渲染（SPA 导航恢复）
    if (searchTerms.length) {
        renderSearchChips();
    }

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
});
