// ── 配置 ──
const SCROLL_SPEED = 3;
const TITLE_STICK_TOP = 32;      // 标题吸顶位置 (px)
const PHASE1_RATIO = 0.25;       // 阶段一占横向滚动比例

// ── 日志数据 ──
const logs = [
    // 文章（大卡片）
    {
        type: 'article',
        date: '2026-07-09', time: '15:30',
        title: '重构动态页',
        summary: '将破损的 HTML 结构彻底重写，改为数据驱动渲染。新增横向时间线布局，支持文章与便笺两种卡片类型。',
        image: null,
        content: '原来的 log_index.htm 存在多处 HTML 结构错误：article 标签嵌套混乱、两个 id="date" 重复、全是 test 占位文本。\n\n这次重构做了三件事：\n\n1. 修 HTML —— 全删重写，只保留必要的骨架\n2. 数据驱动 —— 所有内容由 JS 数组驱动，未来加日志只需往数组里加一个对象\n3. 类型区分 —— 长文用大卡片（带标题摘要图片），短记用小卡片（一句话便笺）\n\n视觉上采用横向滚动时间线布局，左侧固定导航栏用 sticky 定位，日期用竖排衬线体做分隔标记，整体走暗色文艺风。'
    },
    {
        type: 'article',
        date: '2026-07-08', time: '22:30',
        title: '搭建 GitHub Pages',
        summary: '从零搭建个人主页基础框架，选定技术方案，配置 CNAME 记录指向 nyan.work。',
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
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m)}月${parseInt(d)}日`;
}

function formatToday() {
    const now = new Date();
    return `${now.getMonth() + 1}月${now.getDate()}日`;
}

function groupByDate(logList) {
    const groups = new Map();
    logList.forEach(log => {
        if (!groups.has(log.date)) groups.set(log.date, []);
        groups.get(log.date).push(log);
    });
    return groups;
}

// ── 卡片渲染 ──
function renderNoteCard(entry) {
    const card = $(`
        <div class="log-card-note">
            <time>${entry.time}</time>
            <p>${entry.content}</p>
        </div>
    `);
    card.data('entry', entry);
    return card;
}

function renderArticleCard(entry) {
    const imgHtml = entry.image
        ? `<img src="${entry.image}" alt="">`
        : '<span class="card-img-placeholder">+</span>';

    const card = $(`
        <div class="log-card-article">
            <div class="card-img-wrap">${imgHtml}</div>
            <div class="card-title">${entry.title}</div>
            <div class="card-summary">${entry.summary}</div>
            <div class="card-time">${entry.time}</div>
        </div>
    `);

    card.data('article', entry);
    card.data('entry', entry);
    return card;
}

// ── 弹窗 ──
function openModal(article) {
    const $modal = $('#modal');

    if (article.image) {
        $('#modal_img').attr('src', article.image).addClass('has-img');
    } else {
        $('#modal_img').removeClass('has-img').attr('src', '');
    }

    $('#modal_title').text(article.title);
    $('#modal_time').text(`${formatDate(article.date)}  ${article.time}`);
    $('#modal_body').html(article.content.replace(/\n/g, '<br>'));

    $('body').css('overflow', 'hidden');
    $modal.addClass('active');
}

function closeModal() {
    $('body').css({ 'overflow-x': 'auto', 'overflow-y': 'hidden' });
    $('#modal').removeClass('active');
}

// ── 进度条 ──
function getCardCenterX(card) {
    return card.getBoundingClientRect().left + card.offsetWidth / 2 + window.scrollX;
}

// ── 侧边栏滚动（两阶段：标题居中 → 吸顶 → 进度条继续走 → 遮罩出现）──
function updateSidebarScroll() {
    const scrollBody = document.body;
    const maxScroll = scrollBody.scrollWidth - scrollBody.clientWidth;
    if (maxScroll <= 0) return;

    const scrollProgress = scrollBody.scrollLeft / maxScroll;
    const $wrapper = $('#sidebar_scroll');
    const $titleInner = $('.progress-title-inner');
    const $titleFixed = $('#title_fixed');
    const $mask = $('#title_mask');

    const sidebarHeight = $('.sidebar-scroll').height();
    const titleHeight = $titleInner.outerHeight();
    const titleInitialTop = (sidebarHeight - titleHeight) / 2;
    const titleTravel = titleInitialTop - TITLE_STICK_TOP;
    const barHeight = $('.progress-bar').height();
    const extraTravel = barHeight * 0.75;

    let wrapperOffset;
    let isPhase2;

    if (scrollProgress <= PHASE1_RATIO) {
        // 阶段一：标题从居中上移至 32px，进度条跟随移动
        const phase1Progress = scrollProgress / PHASE1_RATIO;
        wrapperOffset = phase1Progress * titleTravel;
        isPhase2 = false;
    } else {
        // 阶段二：标题吸顶，进度条继续上滚，遮罩淡入
        const phase2Progress = (scrollProgress - PHASE1_RATIO) / (1 - PHASE1_RATIO);
        wrapperOffset = titleTravel + phase2Progress * extraTravel;
        isPhase2 = true;
    }

    $wrapper.css('transform', `translateY(-${wrapperOffset}px)`);

    if (isPhase2) {
        $titleInner.css('opacity', 0);
        $titleFixed.css({ opacity: 1, 'pointer-events': 'none' });
        $mask.css({ top: (TITLE_STICK_TOP + titleHeight) + 'px', opacity: 1 });
    } else {
        $titleInner.css('opacity', 1);
        $titleFixed.css('opacity', 0);
        $mask.css('opacity', 0);
    }
}

function updateProgress() {
    const scrollBody = document.body;
    const maxScroll = scrollBody.scrollWidth - scrollBody.clientWidth;
    const barHeight = $('.progress-bar').height();
    if (maxScroll <= 0 || barHeight <= 0) return;

    // 滑动指示器（红点）
    const progress = scrollBody.scrollLeft / maxScroll;
    $('.progress-indicator').css('top', progress * barHeight + 'px');

    // 高亮最近节点
    const viewCenter = scrollBody.scrollLeft + window.innerWidth / 2;
    let closestNode = null;
    let minDist = Infinity;

    $('#progress_nodes .progress-node').each(function () {
        const dist = Math.abs($(this).data('cardCenterX') - viewCenter);
        if (dist < minDist) {
            minDist = dist;
            closestNode = this;
        }
    });

    $('#progress_nodes .progress-node').removeClass('active passed');
    if (closestNode) {
        $(closestNode).addClass('active');
        $(closestNode).prevAll('.progress-node').addClass('passed');
    }
}

function buildProgressBar() {
    const cards = document.querySelectorAll('.log-card-note, .log-card-article');
    if (cards.length === 0) return;

    const nodesContainer = $('#progress_nodes');
    const scrollBody = document.body;
    const totalWidth = scrollBody.scrollWidth;

    // 初始状态：标题居中（相对于 sidebar-scroll）
    const sidebarScrollHeight = $('.sidebar-scroll').height();
    const titleHeight = $('.progress-title-inner').outerHeight();
    const initialTop = (sidebarScrollHeight - titleHeight) / 2;
    $('.progress-title-inner').css('top', initialTop + 'px');

    // 进度条从标题下方开始，留 20px 间距
    const progressOffset = initialTop + titleHeight + 20;
    $('.progress-bar').css({
        marginTop: progressOffset + 'px',
        height: 'calc(100% - ' + progressOffset + 'px)'
    });

    const barHeight = $('.progress-bar').height();

    cards.forEach(function (card) {
        const cardCenterX = getCardCenterX(card);
        const top = Math.max(18, Math.min((cardCenterX / totalWidth) * barHeight, barHeight - 18));

        const entry = $(card).data('entry');
        const isArticle = card.classList.contains('log-card-article');
        const dateStr = formatDate(entry.date);

        let label;
        if (isArticle) {
            label = entry.title;
        } else {
            const text = entry.content;
            label = text.length > 14 ? text.substring(0, 14) + '…' : text;
        }

        const node = $(`
            <div class="progress-node ${isArticle ? 'article' : 'note'}" style="top:${top}px">
                <span class="node-dot"></span>
                <div class="node-text">
                    <span class="node-label">${label}</span>
                    <span class="node-time">${dateStr} ${entry.time}</span>
                </div>
            </div>
        `);

        // 存卡片引用 + 静态 centerX（用于 updateProgress 高亮判断）
        node.data({ cardEl: card, cardCenterX: cardCenterX });

        node.on('click', function () {
            var cardEl = $(this).data('cardEl');
            if (!cardEl) return;

            var targetX = getCardCenterX(cardEl) - window.innerWidth / 2;
            var maxScroll = scrollBody.scrollWidth - scrollBody.clientWidth;
            var clampedX = Math.max(0, Math.min(targetX, maxScroll));

            scrollBody.scrollTo({ left: clampedX, behavior: 'smooth' });
        });

        nodesContainer.append(node);
    });

    // 初始化视觉状态
    updateProgress();
    updateSidebarScroll();

    // 滚动事件（更新进度 + 侧边栏）
    $(scrollBody).on('scroll', function () {
        updateProgress();
        updateSidebarScroll();
    });

    // 窗口缩放时刷新（含节点位置重算）
    $(window).on('resize', function () {
        var barHeight = $('.progress-bar').height();
        var totalWidth = scrollBody.scrollWidth;
        $('#progress_nodes .progress-node').each(function () {
            var cx = $(this).data('cardCenterX');
            var top = Math.max(18, Math.min((cx / totalWidth) * barHeight, barHeight - 18));
            $(this).css('top', top + 'px');
        });
        updateProgress();
        updateSidebarScroll();
    });
}

// ── 页面入口 ──
$(document).ready(function () {
    $('#date').text(formatToday());

    const groups = groupByDate(logs);
    const sortedDates = [...groups.keys()].sort((a, b) => b.localeCompare(a));
    const container = $('#log_container');

    sortedDates.forEach(date => {
        container.append(`
            <div class="date-marker">
                <span>${formatDate(date)}</span>
            </div>
        `);

        groups.get(date).forEach(entry => {
            if (entry.type === 'article') {
                container.append(renderArticleCard(entry));
            } else {
                container.append(renderNoteCard(entry));
            }
        });
    });

    // 构建进度条（必须在卡片渲染之后）
    buildProgressBar();

    // 横向滚轮（弹窗打开时不拦截）
    document.querySelector('body').addEventListener('wheel', function (e) {
        if ($('#modal').hasClass('active')) return;
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY * SCROLL_SPEED;
        }
    }, { passive: false });

    // 弹窗事件
    $('#log_container').on('click', '.log-card-article', function () {
        const article = $(this).data('article');
        if (article) openModal(article);
    });

    $('#modal').on('click', function (e) {
        if (e.target === this) closeModal();
    });

    $('.modal-close').on('click', closeModal);

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
});
