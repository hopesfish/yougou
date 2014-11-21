$().ready(function() {
    $("#loginBtn").click(function() {
        if ($('#username').val() == '' || $("#password").val() == '') {
            alert('请输入账号和密码！');
            return;
        }
        $.ajax({
            type: "POST",
            url: "/api/auth",
            dataType: 'json',
            data: { username: $('#username').val(), password: $("#password").val() }
         })
         .done(function() {
             window.location.href = "index.html";
         })
         .fail(function() {
             alert('抱歉，无法登录！');
         });
    });
});