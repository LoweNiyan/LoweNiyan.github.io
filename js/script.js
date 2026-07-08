function printer(text, element, speed) {
    let timer;
    let i = 0;
    let active = true;
    function type() {
        if (!active) return;
        if (i < text.length) {
            element.text(text.substring(0, i+1));
            i++;
            timer = setTimeout(type, speed);
        }
    }
    type();
    return {
        // 暂停：保持已打印文字不变
        stop: function () {
            active = false;
            clearTimeout(timer);
        },
        // 恢复：从上次位置继续打字
        resume: function () {
            if (!active && i < text.length) {
                active = true;
                type();
            }
        },
        // 彻底清理：停止并清空元素文字
        clear: function () {
            active = false;
            clearTimeout(timer);
            element.text('');
        },
        isDone: function () {
            return i >= text.length;
        }
    };
}

$(document).ready(function () {
    console.log("██╗  ██╗███████╗██╗     ██╗      ██████╗\n██║  ██║██╔════╝██║     ██║     ██╔═══██╗\n███████║█████╗  ██║     ██║     ██║   ██║\n██╔══██║██╔══╝  ██║     ██║     ██║   ██║\n██║  ██║███████╗███████╗███████╗╚██████╔╝\n╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ \n");
});