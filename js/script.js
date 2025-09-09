function printer(text, element, speed) {
    let timer;
    let i = 0;
    function type() {
        if (i < text.length) {
        element.text(text.substring(0, i+1));
        i++;
        timer = setTimeout(type, speed);
        }
    }
    type();
}

$(document).ready(function () {
    console.log("██╗  ██╗███████╗██╗     ██╗      ██████╗\n██║  ██║██╔════╝██║     ██║     ██╔═══██╗\n███████║█████╗  ██║     ██║     ██║   ██║\n██╔══██║██╔══╝  ██║     ██║     ██║   ██║\n██║  ██║███████╗███████╗███████╗╚██████╔╝\n╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ \n");
});