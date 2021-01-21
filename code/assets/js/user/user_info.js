//入口函数
$(function () {
    // 1.定义昵称校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 属性是规则名  值可以是函数 也可以是数组
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间"
            }
        }
    })

    //2.初始化用户基本信息
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //利用layui 中的form.val()给表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }

    //3.重置表单事件  注意 给form表单绑reset事件等价于给button绑定click 事件  但是不要给form绑click  不要给button绑定reset
    $('#btnReset').on('click', function (e) {
        //阻止重置
        e.preventDefault()
        //从新用户渲染
        initUserInfo();
    })

    //4.提交用户修改
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                //判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //更新成功 渲染父页面  window.parent 获取的是iframe的父亲页面对应的方法
                //调用父页面中的更新用户信息和头像方法  getUserInfo()在index.js中 它必须是全局函数
                window.parent.getUserInfo()
            }
        });
    })


})