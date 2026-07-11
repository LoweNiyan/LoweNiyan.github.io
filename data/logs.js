// ── 文章 URL 列表（元数据从对应页面 JSON 中读取）──
var articleUrls = [
    'blogs/test.htm'
];

// ── 短笔记 ──
var notes = [
    { type: 'note', date: '2026-07-11', time: '22:00', content: '[test] 喵…今天挠了一下午纸箱爪子都麻了，该去晒晒月光了喵 (´-ω-`)', image: '../img/logimg/test_image.jpg' },
    { type: 'note', date: '2026-07-11', time: '18:30', content: '[test] 人类为什么要出门呢喵，每天在家晒太阳不好吗…可惜外面的小鸟太吵了' },
    { type: 'note', date: '2026-07-11', time: '15:00', content: '[test] 发现一个新的猫罐头口味！三文鱼啫喱，但主人说太贵了不给我买喵…(´;ω;`)', image: '../img/logimg/test_image.jpg' },
    { type: 'note', date: '2026-07-11', time: '11:00', content: '[test] 今天打碎的杯子比昨天少了一只，是不是说明我的猫爪控制力进步了喵 ✧(≖ ◡ ≖✿)' },
    { type: 'note', date: '2026-07-11', time: '08:00', content: '[test] 早上被快递吵醒了喵，明明昨晚追激光笔追到凌晨三点…快递员还摸了我的头说猫咪乖 (╯°□°）╯' },
    { type: 'note', date: '2026-07-10', time: '23:00', content: '[test] 深夜最适合思考猫生了喵…比如明天吃什么罐头，睡哪个纸箱，要不要挠沙发' },
    { type: 'note', date: '2026-07-10', time: '19:00', content: '[test] 给窗台上的多肉浇水结果把花盆推下去了喵…但那盆多肉先动手的，它挡到我晒太阳了 (。-`ω´-)' },
    { type: 'note', date: '2026-07-10', time: '14:00', content: '[test] 下午的阳光刚好照到毛毯上，暖暖的…于是我卷成一个猫团睡着了，醒来已经是晚饭时间' },
    { type: 'note', date: '2026-07-10', time: '10:00', content: '[test] 今天叼了一只蟑螂给主人当礼物，她尖叫着跑掉了喵…人类真是难懂 ฅ^•ﻌ•^ฅ' },
    { type: 'note', date: '2026-07-09', time: '20:00', content: '[test] 主人说我的睡相像一条猫抓板…我觉得这是夸奖，毕竟猫抓板很受欢迎喵' },
    { type: 'note', date: '2026-07-09', time: '16:00', content: '[test] 冰箱发出了奇怪的声音，我盯着它看了十分钟，然后决定先去吃个罐头冷静一下' },
    { type: 'note', date: '2026-07-09', time: '12:00', content: '[test] 中午的阳光让地板反光得眼花，但我不想挪位置，这里刚好能晒到肚子' },
    { type: 'note', date: '2026-07-08', time: '21:00', content: '[test] 今天学会了如何打开推拉门了喵！虽然是被自己的尾巴卡住才误打误撞发现的' },
    { type: 'note', date: '2026-07-08', time: '17:00', content: '[test] 桌面上多了三个空罐头和五个纸团，主人说再这样就不给零食了…那我先把纸团推到沙发底下毁灭证据喵' },
    { type: 'note', date: '2026-07-07', time: '19:00', content: '[test] 不小心把主人的杯子推下桌子了，整个世界都安静了，就像我每次闯祸后的那种安静' },
];
