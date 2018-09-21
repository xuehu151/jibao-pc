
angular.module ('jibao')
    .factory ('$util', function ($http, $q, $ionicLoading) {

        var ipUrl = 'http://jibao.3tichina.com:80/keppel/api';
        /* 接口地址  */
        var httpURL = {
            getRegisterCodeUrl: ipUrl + '/user/getRegisterCode',



        };
        return {
            /* 返回httpURL  */
            getHttpURL: function () {
                return httpURL;
            },

            /* 清除用户信息  */
            removeUserInfo: function () {
                userInfo = null;
                window.localStorage.removeItem ("userInfo");
            },

            /* 保存用户信息  */
            setUserInfo: function (userInfo) {
                window.localStorage.setItem ("userInfo", JSON.stringify (userInfo));
            },

            /* 获取用户信息  */
            getUserInfo: function () {
                var localUserInfo = window.localStorage.getItem ("userInfo");
                try {
                    userInfo = JSON.parse (localUserInfo);
                } catch (error) {
                    userInfo = null;
                }
                return userInfo;
            },

            /* 格式化日期  */
            formatDate: function (date) {
                var y = date.getFullYear ();
                var m = date.getMonth () + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate ();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },

            /*验证密码
             * 密码由数字 字母 特殊字符的其中两种组成 6到24位
             checkPassword: function (text) {
             var myreg = /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[.#@!~%^&*])|(?=.*\d)(?=.*[.#@!~%^&*]))[a-z\d.#@!~%^&*]{6,24}/i;
             return myreg.test (text);
             },*/

            /*验证手机号*/
            checkPhone: function (text) {
                var myreg = /^1[34578]\d{9}$/;
                return myreg.test (text);
            },

            /* HTTP POST请求  */
            httpPostRequest: function (url, data) {
                $ionicLoading.show ();
                var deferred = $q.defer ();
                var promise = deferred.promise;
                $http ({
                    method: 'POST',
                    url: url,
                    params: data,
                    headers: {"content-type": "application/json;charset=UTF-8"},
                    // transformRequest: function (obj) {
                    //     var str = [];
                    //     for (var s in obj) {
                    //         str.push (encodeURIComponent (s) + "=" + encodeURIComponent (obj[s]));
                    //     }
                    //     return str.join ("&");
                    // },
                    timeout: 1000 * 10 * 6
                }).success (function (response) {
                    $ionicLoading.hide ();
                    //return success
                    deferred.resolve (response);
                }).error (function (response) {
                    //return error
                    $ionicLoading.hide ();
                    deferred.reject (response);
                    //$cordovaToast.showLongBottom ('网络访问超时');
                });
                return promise;
            }

        };
    });
