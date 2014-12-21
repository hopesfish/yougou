$().ready(function() {
    var count = parseInt($(".gifts").attr("data-count")), map = {};

    if (count > 40) { count = 40; }

    while(count > 0) {
        var idx = parseInt(40 * Math.random());
        if (!map[idx]) {
            map[idx] = 'twinking';
            count--;
        }
    }

    $(".gift").each(function(i, element) {
        var count = 100 * Math.random();
        if (map[i]) {
            $(element).addClass("twinking-" + (parseInt(count)%5));
        }
    });
});