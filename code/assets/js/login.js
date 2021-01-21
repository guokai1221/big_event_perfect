//入口函数
$(function () {
    //点击去注册账号 隐藏登录区域 显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击去登录 显示登录区域 隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //自定义校验规则
    //只要引入layui.all.js 就会多出一个对象 layui
    //使用layui的form属性
    var form = layui.form;
    form.verify({
        //定义一个叫pwd的校验规则   用于密码规则
        pwd: [
            //数组中第1个元素,正则
            /^[\S]{6,12}$/,
            //数组中第2个元素,报错信息
            '密码必须6到12位，且不能出现空格'
        ],
        //定义一个叫repwd的校验规则  用于确认密码规则
        repwd: function (value) {  //value表示当前表单的值
            //选择器必须带空格 选择的是后代中的input的name属性 如果name属性值唯一 那么前面的input可以省略
            var pwd = $('.reg-box input[name=password]').val();
            if (pwd !== value) {
                return '两次密码输入不一致！'
            }
        }
    })

    //监听注册页面的点击事件
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                //返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                //跳转到登录页面
                $('#link_login').click();
                //重置form 用DOM的reset()方法
                $('#form_reg')[0].reset();

            }
        });
    })

    //监听登录页面的点击事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //提示信息 保存token 跳转页面
                layer.msg("登录成功");
                //保存token 未来的接口要使用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = '/index.html';
            }
        });
    })
})