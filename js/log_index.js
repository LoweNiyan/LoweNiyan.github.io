// ── 配置 ──
const SCROLL_SPEED = 3;

// ── 日志数据 ──
const logs = [
    // 文章（大卡片）
    {
        type: 'article',
        date: '2026-07-09', time: '15:30',
        title: '重构动态页',
        summary: '将破损的 HTML 结构彻底重写，改为数据驱动渲染。新增横向时间线布局，支持文章与便笺两种卡片类型。',
        url: 'blogs/refactor-log.htm',
        image: null,
        content: '原来的 log_index.htm 存在多处 HTML 结构错误：article 标签嵌套混乱、两个 id="date" 重复、全是 test 占位文本。\n\n这次重构做了三件事：\n\n1. 修 HTML —— 全删重写，只保留必要的骨架\n2. 数据驱动 —— 所有内容由 JS 数组驱动，未来加日志只需往数组里加一个对象\n3. 类型区分 —— 长文用大卡片（带标题摘要图片），短记用小卡片（一句话便笺）\n\n视觉上采用横向滚动时间线布局，左侧固定导航栏用 sticky 定位，日期用竖排衬线体做分隔标记，整体走暗色文艺风。'
    },
    {
        type: 'article',
        date: '2026-07-08', time: '22:30',
        title: '搭建 GitHub Pages',
        summary: '从零搭建个人主页基础框架，选定技术方案，配置 CNAME 记录指向 nyan.work。',
        url: 'blogs/github-pages.htm',
        image: null,
        content: '网站采用纯静态方案：无构建工具，无框架，无包管理器。所有页面使用 .htm 扩展名，jQuery 3.6.3 来自 ASP.NET CDN。\n\n页面结构：\n- index.htm — 首页，Hello World 视差效果 + more 面板\n- pages/about.htm — 关于页（待填充）\n- pages/log_index.htm — 动态/日志页\n- pages/connect.htm — 联系页\n- pages/blogs/ — 博客文章目录\n\n字体方案从 Green Screen 替换为 Good Old DOS（DOS 终端风格），正文从 Rubik 迁移到浏览器默认衬线体，整体更文艺。'
    },

    // 便笺（小卡片）
    { type: 'note', date: '2026-07-09', time: '14:30', content: '修复打字机动画：支持暂停/恢复，关闭面板动画期间保留已打印文字，彻底关闭后才清除。' },
    { type: 'note', date: '2026-07-09', time: '13:00', content: '修复 more 菜单 CSS：inline 元素不响应 transform，为 .more_menu li a 添加 display: inline-block。' },
    { type: 'note', date: '2026-07-09', time: '10:00', content: '创建 AGENTS.md，整理了项目结构、页面接线规范、.htm 约定与注意事项。' },
    { type: 'note', date: '2026-07-08', time: '20:00', content: '设计首页 Hello World 多层视差效果，配合逐字模糊与渐入动画，DOS 终端风格标题。' },
    { type: 'note', date: '2026-07-07', time: '18:00', content: '选定字体方案：正文衬线体、Good Old DOS 标题、JetBrainsMono 等宽。自托管全部字体文件。' },
];

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

// ── 卡片渲染 ──
function renderNoteCard(entry) {
    var card = $('<div class="log-card-note"><time>' + entry.time + '</time><p>' + entry.content + '</p></div>');
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

// ── 文章弹窗 ──
function openModal(article) {
    if (article.image) {
        $('#modal_img').attr('src', article.image).addClass('has-img');
    } else {
        $('#modal_img').removeClass('has-img').attr('src', '');
    }
    $('#modal_title').text(article.title);
    $('#modal_time').text(formatDate(article.date) + '  ' + article.time);
    $('#modal_body').html(article.content.replace(/\n/g, '<br>'));
    if (article.url) {
        $('#modal_link').attr('href', article.url).show();
    } else {
        $('#modal_link').hide();
    }
    $('body').css('overflow', 'hidden');
    $('#modal').addClass('active');
}

function closeModal() {
    $('body').css({ 'overflow-x': 'auto', 'overflow-y': 'hidden' });
    $('#modal').removeClass('active');
}

// ── 滚动到卡片 ──
function scrollToCard(cardEl) {
    var rect = cardEl.getBoundingClientRect();
    var cardCenterX = rect.left + rect.width / 2 + window.scrollX;
    var targetX = cardCenterX - window.innerWidth / 2;
    var maxScroll = document.body.scrollWidth - document.body.clientWidth;
    document.body.scrollTo({
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

function buildIndex() {
    var $list = $('#index_list');
    var groups = groupByDate(logs);
    var sortedDates = Array.from(groups.keys()).sort(function (a, b) { return b.localeCompare(a); });

    sortedDates.forEach(function (date) {
        $list.append('<div class="index-date">' + formatDate(date) + '</div>');

        groups.get(date).forEach(function (entry) {
            var typeClass = 'index-badge-' + (entry.type === 'article' ? 'article' : 'note');
            var badgeText = entry.type === 'article' ? '文' : '记';
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
    // 初始化索引弹窗 clip-path（收缩在按钮中心）
    (function () {
        var center = getIndexBtnCenter();
        $('#index_overlay').css('clip-path', 'circle(0% at ' + center.x + 'px ' + center.y + 'px)');
    })();

    // 渲染卡片
    var groups = groupByDate(logs);
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
    buildIndex();

    // 横向滚轮（弹窗打开时不拦截）
    document.body.addEventListener('wheel', function (e) {
        if ($('#modal').hasClass('active') || $('#index_overlay').hasClass('active')) return;
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY * SCROLL_SPEED;
        }
    }, { passive: false });

    // ── 事件绑定 ──

    // 文章卡片点击
    $('#log_container').on('click', '.log-card-article', function () {
        var article = $(this).data('article');
        if (article) openModal(article);
    });

    // 文章弹窗关闭
    $('#modal').on('click', function (e) {
        if (e.target === this) closeModal();
    });
    $('.modal-close').on('click', closeModal);

    // 索引按钮
    $('#index_btn').on('click', function () {
        if ($('#index_overlay').hasClass('active')) {
            closeIndexOverlay();
        } else {
            openIndexOverlay();
        }
    });

    // 索引弹窗点击背景关闭
    $('#index_overlay').on('click', function (e) {
        if (e.target === this) closeIndexOverlay();
    });
    $('.index-close').on('click', closeIndexOverlay);

    // 键盘快捷键
    $(document).on('keydown', function (e) {
        // Esc: 优先关索引，再关文章弹窗
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

        // 文章弹窗打开时不响应方向键和 i
        if ($('#modal').hasClass('active')) return;

        // i 打开索引 / 切换索引
        if ((e.key === 'i' || e.key === 'I') && !e.metaKey && !e.ctrlKey) {
            if ($('#index_overlay').hasClass('active')) {
                closeIndexOverlay();
            } else {
                openIndexOverlay();
            }
            return;
        }

        if ($('#index_overlay').hasClass('active')) return;

        // ← → 切换卡片
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            var cards = document.querySelectorAll('.log-card-note, .log-card-article');
            if (cards.length === 0) return;

            var viewCenter = document.body.scrollLeft + window.innerWidth / 2;
            var currentIdx = -1;
            var minDist = Infinity;
            for (var i = 0; i < cards.length; i++) {
                var r = cards[i].getBoundingClientRect();
                var cx = r.left + r.width / 2 + window.scrollX;
                var dist = Math.abs(cx - viewCenter);
                if (dist < minDist) { minDist = dist; currentIdx = i; }
            }

            var nextIdx = e.key === 'ArrowRight'
                ? Math.min(currentIdx + 1, cards.length - 1)
                : Math.max(currentIdx - 1, 0);

            if (nextIdx !== currentIdx) scrollToCard(cards[nextIdx]);
        }
    });

    // 键盘提示：滚动后短暂隐藏
    (function () {
        var showTimer;
        var $hint = $('.kb-hint');

        $(window).on('scroll', function () {
            $hint.css('opacity', 0);
            clearTimeout(showTimer);
            showTimer = setTimeout(function () {
                $hint.css('opacity', 1);
            }, 2000);
        });
    })();
});
