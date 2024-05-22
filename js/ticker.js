
document.addEventListener("DOMContentLoaded", function () {
    var images = document.querySelectorAll(".logo_images");
    images.forEach(function (img) {
        img.src = img.getAttribute("src");
    });

    var runningDeadline = document.querySelector('.tickerblock1');
    var totalWidth = 0;
    images.forEach(function (img) {
        totalWidth += img.offsetWidth;
    });
    runningDeadline.style.width = totalWidth + 'px';
});



document.addEventListener("DOMContentLoaded", function () {
    var deadlineColumns = document.querySelectorAll(".ticker .column");
    var runningDeadline = document.querySelector('.tickerblock');
    var totalWidth = 0;

    deadlineColumns.forEach(function (column) {
        totalWidth += column.offsetWidth + parseInt(getComputedStyle(column).marginLeft);
    });

    runningDeadline.style.width = totalWidth + 'px';
});
