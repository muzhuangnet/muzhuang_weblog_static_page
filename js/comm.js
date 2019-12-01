function AjaxPageList(listDiv, sendUrl) {
    InitComment(); //初始化评论数据

    //请求评论数据
    function InitComment() {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: sendUrl,
            beforeSend: function () {
                $(listDiv).html('<p style="line-height:35px;">正在狠努力加载，请稍候...</p>');
            },
            success: function (data) {
                var strHtml = '';
                var floor;
                floor = data.length;
                for (var i in data) {
                    strHtml += '<li  class="comment-content"><span class="comment-f">#' + floor + '</span>' +
                        '<div class="comment-main">';
                    strHtml += '<p><a class="address"' + ' href="' + data[i].user_ip + '" rel="nofollow"';
                    if (data[i].user_ip != "javascript:;") {
                        strHtml += 'target="_blank"';
                    }
                    strHtml += '>' + data[i].user_name + '</a><span class="time">(' + data[i].add_time + ')</span><br/>' +
                        unescape(data[i].content);
                    if (data[i].is_reply == 1) {
                        strHtml +=
                            '<br/>【站长回复(' + data[i].reply_time + ')】：' +
                            unescape(data[i].reply_content);
                    }
                    floor--;
                    strHtml += '</p></div></li>';
                }
                $(listDiv).html(strHtml);
            },
            error: function () {
                $(listDiv).html('<p style="line-height:35px;text-align:center;border:1px solid #f7f7f7;">暂无评论...</p>');
            }
        });
    }
}

$(function () {
    $(".pay_item").click(function () {
        $(this).addClass('checked').siblings('.pay_item').removeClass('checked');
        var dataid = $(this).attr('data-id');
        $(".shang_payimg img").attr("src", "images/" + dataid + "img.jpg");
        $("#shang_pay_txt").text(dataid == "alipay" ? "支付宝" : "微信");
    });
});

function dashangToggle() {
    $(".hide_box").fadeToggle();
    $(".shang_box").fadeToggle();
}
/*表单AJAX提交封装(包含验证)
------------------------------------------------*/
function AjaxInitForm(formObj, btnObj, isDialog, urlObj, callback, modelid) {
    $(formObj).Validform({
        tiptype: 3,
        callback: function (form) {
            //AJAX提交表单
            $(form).ajaxSubmit({
                beforeSubmit: formRequest,
                success: formResponse,
                error: formError,
                url: $(formObj).attr("url"),
                type: "post",
                dataType: "json",
                timeout: 60000
            });
            return false;
        }
    });

    //表单提交前
    function formRequest() {
        $(".comment-prompt").css('display', 'block');
        $(".comment-success").css('display', 'none');
        $(btnObj).prop("disabled", true);
        $(btnObj).html("提交中...");
    }

    //表单提交后
    function formResponse(data) {
        if (data.status == 1) {
            $(btnObj).html("提交成功");
            //是否提示，默认不提示
            if (isDialog == 1) {
                var d = dialog({ content: data.msg }).show();
                setTimeout(function () {
                    d.close().remove();
                    AjaxPageList('#comment_list', '请求地址');//请求地址
                    $(".comment-prompt").css('display', 'none');
                    $(".comment-success").css('display', 'block');
                }, 2000);
            } else {
                AjaxPageList('#comment_list', '请求地址');//请求地址
                $(".comment-prompt").css('display', 'none');
                $(".comment-success").css('display', 'block');
            }
        } else {
            dialog({ title: '提示', content: data.msg, okValue: '确定', ok: function () { } }).showModal();
            $(btnObj).prop("disabled", false);
            $(btnObj).html("再次提交");
            $(".comment-prompt").css('display', 'none');
            $(".comment-success").css('display', 'none');
        }
    }
    //表单提交出错 
    function formError(XMLHttpRequest, textStatus, errorThrown) {
        dialog({ title: '提示', content: '状态：' + textStatus + '；出错提示：' + errorThrown, okValue: '确定', ok: function () { } }).showModal();
        $(btnObj).prop("disabled", false);
        $(btnObj).val("再次提交");
        $(".comment-prompt").css('display', 'none');
        $(".comment-success").css('display', 'none');
    }
}