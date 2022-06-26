layui.define([
    'jquery',
], function (exports) {
    'use strict';
    const $ = layui.jquery
     /**
     * @param {string} open         打开弹窗类名
     * @param {string} body         弹窗主体
     * @param {object} request      请求参数
     *      @param {string} url     请求地址
     *      @param {string} method  请求方法默认get
     */
    function Popup(config) {
        let defaultConfig = {
            open:'',
            body:'',
            request:{
                url:'',
                method:'get',
            }
        }
        this.config = $.extend(defaultConfig,config);
        this.open();
        console.log(this.guid())
    }
    let PopupMethod = Popup.prototype
    //生成唯一ID
    PopupMethod.guid=function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    //打开弹窗
    PopupMethod.open = function(){
        $(this.config.open).on('click',function(){
            $(this.config.body).show();
        })
        console.log(this.config)
    }
    //创建结构
    
    exports('Popup',Popup)
});