$().ready(function() {
    $("#audio")[0].play();

    if ($(".gifts").size() == 0) { return; }

    var count = parseInt($(".gifts").attr("data-count")),
        nums = [],
        map = {};

    for (var i=0; i<42; i++) {
        nums.push(i);
    }

    nums.sort(function(a, b) {
        return Math.random() > 0.5 ? -1 : 1;  
    });

    if (count > 42) { count = 42; }

    while(count > 0) {
        var idx = nums.pop();
        map[idx] = 'twinking';
        count--;
    }

    $(".gift").each(function(i, element) {
        var count = 100 * Math.random();
        if (map[i]) {
            $(element).removeClass("gift-gray");
        }
    });
});