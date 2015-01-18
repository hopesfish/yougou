$().ready(function() {

    $(".mask").click(function() {
        $(this).hide();
        $(".gift-c img").addClass("moving");
    });

    $(".collect-btn").click(function() {
        $(".gift-c img").removeClass("moving");
        $('.mask-collect').show();
    });

    setTimeout(function() {
        if ($(".mask-visible").size() > 0) { return; }
        $(".gift-c img").addClass("moving");
    }, 1000);

    var idx = 1,
        len = $(".winners p").size();

    setInterval(function() {
        if (idx == len) { idx = 0; }
        $(".winners p.current").removeClass("current").hide();
        $(".winners p:nth-child(" + (idx+1) + ")").addClass("current").fadeIn('slow');
        idx++;
    }, 3000);
});