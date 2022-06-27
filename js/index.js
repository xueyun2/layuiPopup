layui.config({
    base: './js/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    Popup: 'popup'
}).use(['Popup'], function () {
    let Popup = layui.Popup
    Popup({
        open: '#open',
        title:'第一个',
        isSearch:false,
        isPage:false,
        request: {
            url: 'http://192.168.1.254:8086/api/content/hosp/sel',
            method: 'post',
            par: {}
        }
    });
    Popup({
        open: '#open2',
        title:'带搜索popup',
        isSearch:true,
        isPage:true,
        listFeedback:false,
        request: {
            url: 'http://192.168.1.254:8086/api/content/hosp/sel',
            method: 'post',
            par: {}
        }
    });

})