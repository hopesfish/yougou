$().ready(function() {
    $(".update").click(function() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3001/finddiff/' + $(this).attr('data-id') + '/bonus',
            data: { bonus: '10', token: (new Date()).getTime() },
            dataType: 'text',
            success: function(data) {
                //window.location.reload();
            },
            error: function(xhr, type) {
                alert('无法保存游戏分数！');
            }
        })
    });
});