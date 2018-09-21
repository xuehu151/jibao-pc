/**
 * Created by Administrator on 2018/9/12.
 */
angular.module('jibao')
    .factory('$urlConfigService', function () {
        return {
            //微博
            loginWbKey : '3458636889',
            loginWbSecret : '47e3ba5bd6bb3b73f70cb41cd7b9d569',
            // loginWbUri : 'http://127.0.0.1:8020/jibao-PC/index.html',
            loginWbUri : 'http://jibao.3tichina.com/jibao-PC/index.html',
            //微信
            appid : 'wx2d7bc2047dd1056e',
            loginWeChatUri : 'http://jibao.3tichina.com/jibao-PC'
        }

    });



