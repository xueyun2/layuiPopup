layui.define([
    'jquery',
    'layer'
], function (exports) {
    'use strict';
    const $ = layui.jquery
    const layer = layui.layer
    /**
    * @param {string} open          打开弹窗类名
    * @param {string} name          表单name名称
    * @param {Boolean} isPage       是否开启分页
    * @param {Boolean} isSearch     是否开启搜索
    * @param {Boolean} listFeedback 点击列表直接反馈而不是选择
    * @param {object} request       请求参数
    *      @param {string} url      请求地址
    *      @param {string} method   请求方法默认get
    *      @param {object} par      请求参数
    */
    let method = {
        //生成唯一ID
        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        //打开弹窗事件
        open: function (open, onlyid) {
            let mask = $('#' + onlyid + 'mask')
            $(open).on('click', function () {
                method.openAndCloseAnimate(onlyid, true)
            })
            mask.on('click', function () {
                method.openAndCloseAnimate(onlyid, false)
            })
        },
        //打开动画
        openAndCloseAnimate: function (onlyid, isOpen = false, time = 500) {
            let mask = $('#' + onlyid + 'mask')
            let body = $('#' + onlyid)
            let bodyEnter = { bottom: 0 }
            let bodyOut = { bottom: '-800px' }
            let maskEnter = { opacity: 1 }
            let maskOut = { opacity: 0 }
            if (isOpen) {

                mask.show().animate(maskEnter, 0)
                body.show().animate(bodyEnter, time)
            } else {
                body.animate(bodyOut, time, function () {
                    $(this).hide()
                })
                mask.animate(maskOut, time, function () {
                    $(this).hide();
                })
            }
        },
        //创建结构
        createTemplate: function (onlyid, config) {
            let template = `
            <div class="popup" id="${onlyid}" style="display: none;">
                ${config.title ? `<div class="popup-title">${config.title}</div>` : ``}
              ${config.isSearch ? `<div class="popup-head">
              <div class=" search-box">
                    <i class="search-icon border-right p-lr-10"></i>
                    <input type="text" class="popup-search" placeholder="输入关键字">
                </div>
          </div>`: ``}  
                <div class="popup-content">
                    <ul class="list">
                    </ul>
                </div>
                <div class="popup-footer">
                    ${config.isPage ? `<div class="page">
                    <div class="page-up">上一页</div>
                    <div>
                        <span class="current">1</span>/<span class="total">1</span>
                    </div>
                    <div class="page-next">下一页</div>
                </div>`: ``}
                ${!config.listFeedback ? `<button type="button" class="submit">确认</button>` : ``}
                </div>
            </div>
            <div class="mask" id="${onlyid + 'mask'}" style="display: none;"></div>
            `
            $('body').append(template)
        },
        //请求数据生成列表
        getListData: function ({ method = 'post', url, par = {} }, callback) {
            $.ajax({
                type: method,
                url: url,
                data: par,
                success: function (res) {
                    let itemList = ''
                    res.data.forEach(item => {
                        itemList += `<li class="item" data-listId="${item.id}">${item.name}</li>`
                    })
                    callback(itemList, res.count += 1)
                }
            });
        },
        //防抖函数
        debounce: function (func, wait) {
            let timeout;
            return function () {
                // 清空定时器
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.call(this)
                }, wait)
            }
        },
        //搜索功能
        search: function (onlyid, config) {
            let inputNode = $('#' + onlyid).find('.popup-search')
            let _this = this
            function eventSearch() {
                let text = inputNode.val();
                _this.getListData({
                    url: config.request.url, par: {
                        search: text,
                        page: 1
                    }
                }, function (e, total) {
                    $('#' + onlyid).find('.list').html('')
                    $('#' + onlyid).find('.list').append(e)
                    $('#' + onlyid).find('.total').text(total)
                })
            }
            inputNode.on('input', this.debounce(eventSearch, 500))
        },
        //分页
        setPage: function (onlyid, config) {
            let pageUP = $('#' + onlyid).find('.page-up')
            let pageNext = $('#' + onlyid).find('.page-next')
            let pageCurrent = $('#' + onlyid).find('.current')
            let pageTotal = $('#' + onlyid).find('.total')
            let totalCount = pageTotal.text() - 0
            let current = pageCurrent.text() - 0
            setPageStatus(current, totalCount)
            pageUP.on('click', function () {
                let count = pageCurrent.text() - 0
                if (count == 1) {
                    return false
                }
                count--
                pageCurrent.text(count)
                method.getListData({
                    url: config.request.url,
                    par: {
                        search: '',
                        page: count
                    }
                }, function (e) {
                    $('#' + onlyid).find('.list').html('')
                    $('#' + onlyid).find('.list').append(e)

                })
                console.log('上一页', count)
            })
            pageNext.on('click', function () {
                let count = pageCurrent.text() - 0
                if (count == totalCount) {
                    return false
                }
                count++
                pageCurrent.text(count)
                method.getListData({
                    url: config.request.url,
                    par: {
                        search: '',
                        page: count
                    }
                }, function (e) {
                    $('#' + onlyid).find('.list').html('')
                    $('#' + onlyid).find('.list').append(e)
                })
                console.log('下一页', count)
            })
            // 设置分页状态
            function setPageStatus(currentPage, totalPage) {
                if (currentPage === 1) {
                    pageUP.css('color', '#999')
                }
                if (currentPage === totalPage) {
                    pageNext.css('color', '#999')
                }
                if (currentPage < totalPage) {
                    pageNext.css('color', '#333')
                }
            }

        },
        //列表选中状态
        selectList: function (onlyid, config) {
            let submitButton = $('#' + onlyid).find('.submit')
            let value = ''
            let name = ''
            $(document).on('click', `${'#' + onlyid} .item`, function () {
                $(this).addClass('active').siblings().removeClass('active')

                if (config.listFeedback) {
                    value = $(this).data('listid')
                    name = $(this).text()
                    if (!value && value !== 0) {
                        layer.msg('请选择一项再确认。', { icon: 2 })
                        return false
                    }
                    $('#' + onlyid + 'input').val(value)
                    $(config.open).val(name)
                    method.openAndCloseAnimate(onlyid, false)
                }
            })
            if (config.listFeedback){
                return false;
            } 
            submitButton.on('click', function () {

                let listItem = $('#' + onlyid).find('.item')

                listItem.each(function (index, item) {
                    let isActive = $(item).hasClass('active')
                    console.log(isActive)
                    if (isActive) {
                        value = $(item).data('listid')
                        name = $(item).text()
                        return
                    }
                })
                if (!value && value !== 0) {
                    layer.msg('请选择一项再确认。', { icon: 2 })
                    return false
                }
                $('#' + onlyid + 'input').val(value)
                $(config.open).val(name)
                method.openAndCloseAnimate(onlyid, false)
            })
        },
        //创建隐藏域input
        createInput: function (onlyid, config) {
            $(config.open).after(`<input id="${onlyid + 'input'}" type="hidden" name="${config.name}" placeholder="请选择">`)
        }
    }
    function Popup(setConfig = {}) {
        //默认参数
        let defaultConfig = {
            open: '',
            isSearch: false,
            isPage: false,
            listFeedback: true,
            name: 'popup',
            request: {
                url: '',
                method: 'get',
                par: {
                    search: '',
                    page: 1
                }
            }
        }
        //合并参数
        let config = $.extend(defaultConfig, setConfig);
        //生成唯一ID
        let onlyid = method.guid()
        //创建隐藏Input
        method.createInput(onlyid, config)
        //创建模板
        method.createTemplate(onlyid, config)
        //设置打开入口
        method.open(config.open, onlyid)
        //请求渲染列表数据
        method.getListData(config.request, function (e, total) {
            if (config.isPage) {
                $('#' + onlyid).find('.total').text(total)
                //分页功能
                method.setPage(onlyid, config)
            }
            $('#' + onlyid).find('.list').append(e)
            //设置列表选中状态
            method.selectList(onlyid, config);
        })
        //搜索功能
        if (config.isSearch) {
            method.search(onlyid, config)
        }

    }
    exports('Popup', Popup)
});