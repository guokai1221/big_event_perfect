// 开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net'
// 测试环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net'
//生成环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net'


//注意 每次调用 $.get() $.post() $.ajax()的时候
//会先调用 ajaxPrefilter 这个函数
//在这个函数中 可以呢到我们给ajax提供的配置对象 
//拦截所有ajax请求  在ajax() post() get()请求之前做的操作
//在发送ajax请求之前 对url地址进行处理 这样方便管理
$.ajaxPrefilter(function (options) {
    // options 获取到ajax所有的参数信息
    //1.添加路径前缀
    options.url = baseURL + options.url;

    //2.给有权限的路径添加头信息
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token' || "")
        }
    }
    //3.登录拦截(不登录 不允许访问其他页面)
    options.complete = function (res) {
        console.log(res);
        var obj = res.responseJSON;
        if (obj.status !== 0 && obj.message === '身份认证失败！') {
            //1.清空 token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html'
        }
    }

})