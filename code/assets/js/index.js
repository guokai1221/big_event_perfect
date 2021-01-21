//入口函数
$(function () {
    //1.获取用户信息
    getUserInfo()
    //2.点击按钮 实现退出功能
    $('#btnLogout').on('click', function () {
        layui.layer.confirm('是否退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储中的 token
            localStorage.removeItem('token')
            //重新跳转到登录页面
            location.href = '/login.html'
            //关闭confirm 询问框
            layer.close(index);
        });
    })
})
//获取用户信息(封装到入口函数外面) 原因 后面其他页面要调用
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem('token' || "")
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功
            renderAvatar(res.data)
        }
    });
}

function renderAvatar(user) {
    //渲染名称 (nickname优先 如果没有 就用username)
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    //渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}