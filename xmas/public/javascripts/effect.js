$().ready(function() {
    $(".gift").each(function(i, element) {
        var count = i + Math.random(10);
        $(element).addClass("twinking-" + (parseInt(count)%5));
    });
});