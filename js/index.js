layui.config({
    base: './js/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    Popup: 'popup'
}).use(['Popup'],function () {
    let Popup = layui.Popup
    let popup1 =  new Popup();
    
})