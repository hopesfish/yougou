$().ready(function() {

    $(".mask").click(function() {
        $(this).hide();
        $(".gift-c img").addClass("moving");
    });

    $(".collect-btn").click(function() {
        $(".gift-c img").removeClass("moving");
        $('.mask-collect').show();
    });

    $(".vote-btn").click(function() {
        $(".gift-c img").removeClass("moving");
        $('.mask-wait').show();
    });

    setTimeout(function() {
        if ($(".mask-visible").size() > 0) { return; }
        $(".gift-c img").addClass("moving");
    }, 1000);

    var idx = 1,
        len = $(".winners p").size();

    /*
    setInterval(function() {
        if (idx == len) { idx = 0; }
        $(".winners p.current").removeClass("current").hide();
        $(".winners p:nth-child(" + (idx+1) + ")").addClass("current").fadeIn('slow');
        idx++;
    }, 3000);*/

    if ($(".mask-visible").size() > 0) {
        var time = 5;
        var t = setInterval(function() {
            if (time <= 0) { return; }
            var txt = --time + '秒后自动关闭...';
            $(".mask-visible p").text(txt);
        }, 1000);
        setTimeout(function() {
            clearInterval(t);
            $(".mask-visible").hide();
            $(".gift-c img").addClass("moving");
        }, 5000);
    }
});