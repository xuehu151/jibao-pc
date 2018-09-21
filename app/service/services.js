angular.module('jibao')

/*    .factory('locals', ['$window', function ($window) {
 return {
 //存储单个属性
 set: function (key, value) {
 $window.localStorage[key] = value;
 },
 //读取单个属性
 get: function (key, defaultValue) {
 return $window.localStorage[key] || defaultValue;
 },
 //存储对象，以JSON格式存储
 setObject: function (key, value) {
 $window.localStorage[key] = JSON.stringify(value);
 },
 //读取对象
 getObject: function (key) {
 return JSON.parse($window.localStorage[key] || '{}');
 }
 }
 }])

 .factory('loginOrRegist', function ($http, $util) {
 return {
 getRegisterCode: function (data) {
 console.info('+++++++++++++')
 return $util.httpPostRequest($util.getHttpURL().getRegisterCodeUrl, data);
 }

 };
 });*/
    .service("loginOrRegist", [ "$q", "$http", function ( $q, $http ) {
        this.httpPostRequest = function ( url, data ) {
            // $ionicLoading.show();
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
                method : 'POST',
                url : url,
                params : data,
                headers : { "content-type" : "application/json;multipart/form-data;charset=UTF-8" },
                // transformRequest: function (obj) {
                //     var str = [];
                //     for (var s in obj) {
                //         str.push (encodeURIComponent (s) + "=" + encodeURIComponent (obj[s]));
                //     }
                //     return str.join ("&");
                // },
                timeout : 1000 * 10 * 6
            }).success(function ( response ) {
                // $ionicLoading.hide();
                //return success
                deferred.resolve(response);
            }).error(function ( response ) {
                //return error
                // $ionicLoading.hide();
                deferred.reject(response);
                //$cordovaToast.showLongBottom ('网络访问超时');
            });
            return promise;
        };
    } ])

    .factory("$userInfoServe", function ( ) {
        return {
            /* 保存用户信息  */
            setUserInfo : function ( userInfo ) {
                window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
            },

            /* 获取用户信息  */
            getUserInfo : function () {
                var localUserInfo = window.localStorage.getItem("userInfo");
                try {
                    userInfo = JSON.parse(localUserInfo);
                } catch ( error ) {
                    userInfo = null;
                }
                return userInfo;
            },

            /* 清除用户信息  */
            removeUserInfo : function () {
                userInfo = null;
                window.localStorage.removeItem("userInfo");
            }
        }
    })

    .factory('$GetRequestUrl', function () {
        return {
            GetRequest : function () {
                var url = location.search;
                var theRequest = new Object();
                if ( url.indexOf("?") != -1 ) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for ( var i = 0; i < strs.length; i++ ) {
                        theRequest[ strs[ i ].split("=")[ 0 ] ] = unescape(strs[ i ].split("=")[ 1 ]);
                    }
                }
                return theRequest;
            },
            checkRate : function ( nubmer ) {
                var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,10}$/);
                if ( reg.test(nubmer) ) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    })

    .factory("$loadingServe", function () {//加载动画组件
        return {
            loadingTips : function ( index ) {
                if ( index === 1 ) {
                    layui.use('layer', function () {
                        loadTip = layer.load(1, {
                            shade : [ 0.1, '#fff' ] //0.1透明度的白色背景
                        });
                    });
                }
                else if ( index === 2 ) {
                    layer.close(loadTip);
                }
            }
        }
    })

    .factory('$longAgoService', function () {
        return {
            /*距离某一时间还有多少长时间*/
            countTime : function ( setTime ) {
                var date = new Date();//获取当前时间
                var now = date.getTime();

                var endDate = new Date(setTime); //设置截止时间
                var end = endDate.getTime();

                var leftTime = end - now;//计算时间差
                var d, h, m, s;
                if ( leftTime >= 0 ) {//定义变量 d,h,m,s保存倒计时的时间
                    d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    m = Math.floor(leftTime / 1000 / 60 % 60);
                    s = Math.floor(leftTime / 1000 % 60);
                    return {
                        /*hours:checkTime (d*24 + h),
                         minute:checkTime (m),
                         second:checkTime (s)*/
                        hours : (d * 24 + h),
                        minute : m,
                        second : s
                    }
                }
                else {
                    return '0'
                }
                function checkTime ( i ) { //将0-9的数字前面加上0，例1变为01
                    if ( i < 10 ) {
                        i = "0" + i;
                    }
                    return i;
                }
                //return hours, minute, second;
            },
            timeago : function ( dateTimeStamp ) {
                //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，
                // 就是十位数的时间戳。13位数的都是时间毫秒。
                var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
                var hour = minute * 60;
                var day = hour * 24;
                var week = day * 7;
                var halfamonth = day * 15;
                var month = day * 30;
                var now = new Date().getTime();   //获取当前时间毫秒
                var diffValue = now - dateTimeStamp;//时间差
                if ( diffValue < 0 ) {
                    return;
                }
                var minC = diffValue / minute;  //计算时间差的分，时，天，周，月
                var hourC = diffValue / hour;
                var dayC = diffValue / day;
                var weekC = diffValue / week;
                var monthC = diffValue / month;
                if ( monthC >= 1 && monthC <= 3 ) {
                    result = " " + parseInt(monthC) + "月前"
                }
                else if ( weekC >= 1 && weekC <= 3 ) {
                    result = " " + parseInt(weekC) + "周前"
                }
                else if ( dayC >= 1 && dayC <= 6 ) {
                    result = " " + parseInt(dayC) + "天前"
                }
                else if ( hourC >= 1 && hourC <= 23 ) {
                    result = " " + parseInt(hourC) + "小时前"
                }
                else if ( minC >= 1 && minC <= 59 ) {
                    result = " " + parseInt(minC) + "分钟前"
                }
                else if ( diffValue >= 0 && diffValue <= minute ) {
                    result = "刚刚"
                }
                else {
                    var datetime = new Date();
                    datetime.setTime(dateTimeStamp);
                    var Nyear = datetime.getFullYear();
                    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
                    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
                    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
                    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
                    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
                    result = Nyear + "-" + Nmonth + "-" + Ndate
                }
                return result;
            }
        }

    })

    .service("$modalService", [ "$modal", function ( $q ) {
        this.modalBox = function ( msg, num ) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.alert(msg, {
                    skin : 'layer-ext-moon', //样式类名
                    closeBtn : 0
                })
            });
        };

        this.modalBoxError = function ( msg, num, timeout ) {
            layui.use('layer', function () {
                layer.confirm(msg, {
                    time : 0, //不自动关闭
                    btn : [ '确定' ],
                    yes : function ( index ) {
                        layer.close(index);
                        timeout(function () {
                            location.reload();
                        }, 500)
                    }
                });
            });
        };

        this.modalConfirm = function ( msg, info, state, target ) {
            layui.use('layer', function () {
                layer.confirm(msg, {
                    btn : [ '确定' ] //按钮
                }, function () {
                    state.go(target);
                    layer.close(layer.index);
                });
            });
        };

        this.modalMsg = function ( msg ) {
            layui.use('layer', function () {
                layer.msg(msg);
            })
        };


    } ]);


