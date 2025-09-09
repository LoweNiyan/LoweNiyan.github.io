const now = new Date();

const year = now.getFullYear(); // 年
const month = now.getMonth(); // 月份
const day = now.getDate();      // 日
const hours = now.getHours();   // 时
const minutes = now.getMinutes(); // 分
const seconds = now.getSeconds(); // 秒

const scrollSpeedMultiplier = 10;

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const displayMonth = months[month]

let displayDate = `${day} ${displayMonth} ${year}`

$(document).ready(function() {
    $('#date').text(displayDate);

    const bodyElement = document.querySelector('body');
    bodyElement.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY * scrollSpeedMultiplier;
        }
    }, { passive: false });
});