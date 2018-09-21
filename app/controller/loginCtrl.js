//List Controller
function loginCtrl ( $scope, $state, loginOrRegist, $interval, $modalService, $userInfoServe, $timeout, $rootScope, $loadingServe, $GetRequestUrl, $stateParams, $urlConfigService ) {
    var weibo = $stateParams.weibo;
    $rootScope.homeIndex = '';
    $rootScope.headerShowHide = false;
    $scope.paracont = "获取验证码";
    var second = 59,
        timePromise = undefined;
    var canClick = true;
    var userImg;
    var login = $scope.login = {
        url : {
            verifyUrl : ipUrl + '/user/getValidate',
            getRegisterCodeUrl : ipUrl + '/user/getRegisterCode',
            registerUrl : ipUrl + '/user/register',
            loginUrl : ipUrl + '/login',
            weiboLoginUrl : ipUrl + '/weiboLogin',
            wxLoginUrl : ipUrl + '/wxLogin'
        },
        state : Math.random() * 10,
        current : 1,
        btnDisabled : false,
        registerId : '',
        tipInfo : '请输入正确的手机号',
        emailOfPhone : 1,
        weiboData : {
            code : '',
            client_id : '',
            redirect_uri : '',
            client_secret : ''
        },
        weChatData : {
            code : ''
        },
        data : {
            regType : 1,
            registerId : '',
            timestamp : '',
            effective : ''
        },
        registInfo : {
            registerType : 'MOBILE',
            passwd : '',
            code : ''
        },
        loginData : {
            registerId : '',
            passwd : ''
        },
        ForgetPass : function () {
            $state.go('findPassword')
        },
        LogonOrResgist : function ( num ) {
            this.current = num;
        },
        LoginBtn : function () {
            if ( !login.loginData.registerId ) {
                $modalService.modalBox('请输入正确的手机号');
            }
            else if ( !login.loginData.passwd ) {
                $modalService.modalBox('请输入注册密码');
            }
            else {
                loginOrRegist.httpPostRequest(login.url.loginUrl, login.loginData)
                    .then(function ( response ) {
                        console.info(response);
                        if ( response.code === 1 ) {
                            $modalService.modalMsg('登录' + response.message);
                            response.object.url = response.map.url;
                            $userInfoServe.setUserInfo(response.object);
                            var userInfo = $userInfoServe.getUserInfo();
                            sessionStorage.setItem('weiboLogin', 2);
                            if ( !userInfo.icon ) {
                                userImg = $rootScope.userImg = '././static/img/userhead.png';
                            }
                            else {
                                userImg = $rootScope.userImg = userInfo.url + userInfo.icon;
                            }
                            sessionStorage.setItem('userImg', userImg);
                            console.info(userInfo);
                            $state.go('home')
                        }
                        else {
                            $modalService.modalBox(response.message);
                        }
                    });
            }
        },
        EmailOrPhone : function ( num ) {
            login.btnDisabled = false;
            canClick = true;
            $scope.paracont = "获取验证码";
            $interval.cancel(timePromise);
            login.data.registerId = '';
            login.registInfo.passwd = '';
            login.registerId = '';
            second = 59;
            if ( num === 1 ) {
                login.emailOfPhone = 2;
                login.registInfo.registerType = 'MAIL';
                this.tipInfo = '请输入正确的邮箱号';
            }
            else if ( num === 2 ) {
                login.emailOfPhone = 1;
                login.registInfo.registerType = 'MOBILE';
                this.tipInfo = '请输入正确的手机号';
            }
        },
        WeiboLogin : function ( name ) {
            sessionStorage.setItem('weiboName', name);
            location.href = 'https://api.weibo.com/oauth2/authorize?client_id=' + $urlConfigService.loginWbKey + '&redirect_uri=' + $urlConfigService.loginWbUri
        },
        QQLogin : function () {
            $modalService.modalBox('开发中');
        },
        WeChatLogin : function ( name ) {
            sessionStorage.setItem('WeChatName', name);
            location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + $urlConfigService.appid + '&redirect_uri=' + $urlConfigService.loginWeChatUri + '&response_type=code&scope=snsapi_login';//&state='+login.state +'#wechat_redirect
        },
        RegistBtn : function () {
            if ( login.emailOfPhone === 2 ) {
                login.data.registerId = login.registerId;
            }
            if ( !login.data.registerId ) {
                $modalService.modalBox(login.tipInfo);
            }
            else if ( !$GetRequestUrl.checkRate(login.registInfo.passwd) ) {
                $modalService.modalBox('请输入8-10位字母+数字的密码');
            }
            else if ( !login.registInfo.code ) {
                $modalService.modalBox('请输入验证码');
            }
            else {
                login.registInfo.registerId = this.data.registerId;
                loginOrRegist.httpPostRequest(login.url.registerUrl, login.registInfo)
                    .then(function ( response ) {
                        console.info('注册', response);
                        if ( response.code === 1 ) {
                            $modalService.modalBox('注册' + response.message);
                            $userInfoServe.setUserInfo(response.object);
                            $state.go('registerSuccess')
                        }
                        else {
                            $modalService.modalBox(response.message);
                        }
                    });
            }
        },
        GetCode : function () {
            if ( login.emailOfPhone === 2 ) {
                login.data.registerId = login.registerId;
            }

            if ( !login.data.registerId ) {
                $modalService.modalBox(login.tipInfo);
            }
            else if ( !$GetRequestUrl.checkRate(login.registInfo.passwd) ) {
                $modalService.modalBox('请输入8-10位字母+数字的密码');
            }
            else {
                $loadingServe.loadingTips(1);
                if ( second === 59 ) {
                    if ( !login.data.timestamp && !login.data.effective ) {
                        loginOrRegist.httpPostRequest(login.url.verifyUrl)
                            .then(function ( response ) {
                                console.info(response);
                                if ( response.code === 1 ) {
                                    login.data.timestamp = response.object.timestamp;
                                    login.data.effective = response.object.effective;
                                    loginOrRegist.httpPostRequest(login.url.getRegisterCodeUrl, login.data)
                                        .then(function ( response ) {
                                            console.info('+++++++++++++', response);
                                            $loadingServe.loadingTips(2);
                                            if ( response.code === 1 ) {
                                                $modalService.modalBox('验证码发送' + response.message);
                                                if ( canClick ) {
                                                    timePromise = $interval(function () {
                                                        if ( second <= 0 ) {
                                                            $interval.cancel(timePromise);
                                                            timePromise = undefined;
                                                            canClick = true;
                                                            second = 59;
                                                            login.btnDisabled = false;
                                                            $scope.paracont = "重发验证码";
                                                        }
                                                        else {
                                                            login.btnDisabled = true;
                                                            $scope.paracont = second + "s后可重发";
                                                            second--;
                                                            canClick = false;
                                                        }
                                                    }, 1000, 100);
                                                }
                                                login.data.timestamp = '';
                                                login.data.effective = '';
                                            }
                                            else {
                                                $modalService.modalBox(response.message);
                                            }
                                        });
                                }
                                else {
                                    $loadingServe.loadingTips(2);
                                    $modalService.modalBox(response.message);
                                }
                            });
                    }
                }
                else {
                    login.btnDisabled = true;
                }

            }

        }
    };

    var pramas = $GetRequestUrl.GetRequest();
    var reponsecode = pramas[ 'code' ];
    var weiboName = sessionStorage.getItem('weiboName');
    var WeChatName = sessionStorage.getItem('WeChatName');
    if ( typeof reponsecode != 'undefined' && weiboName ) {
        login.weiboData.code = reponsecode;
        login.weiboData.client_id = $urlConfigService.loginWbKey;
        login.weiboData.client_secret = $urlConfigService.loginWbSecret;
        login.weiboData.redirect_uri = $urlConfigService.loginWbUri;
        $loadingServe.loadingTips(1);
        loginOrRegist.httpPostRequest(login.url.weiboLoginUrl, login.weiboData)
            .then(function ( response ) {
                $loadingServe.loadingTips(2);
                if ( response.code === 1 ) {
                    $modalService.modalMsg('登录' + response.message);
                    response.object.url = response.map.url;
                    $userInfoServe.setUserInfo(response.object);
                    var userInfo = $userInfoServe.getUserInfo();
                    sessionStorage.setItem('weiboLogin', 2);
                    if ( !userInfo.icon ) {
                        userImg = $rootScope.userImg = '././static/img/userhead.png';
                    }
                    else {
                        if(userInfo.icon.indexOf('http') !== -1){
                            userImg = $rootScope.userImg = userInfo.icon;
                        }else {
                            userImg = $rootScope.userImg = userInfo.url + userInfo.icon;
                        }
                    }
                    sessionStorage.setItem('userImg', userImg);
                    $state.go('home')
                }
                else {
                    $modalService.modalBox(response.message);
                }
            });
    }
    else if ( typeof reponsecode != 'undefined' && WeChatName ) {
        console.info('WeChatName', WeChatName);
        login.weChatData.code = reponsecode;
        $loadingServe.loadingTips(1);
        loginOrRegist.httpPostRequest(login.url.wxLoginUrl, login.weChatData)
            .then(function ( response ) {
                $loadingServe.loadingTips(2);
                if ( response.code === 1 ) {
                    $modalService.modalMsg('登录' + response.message);
                    response.object.url = response.map.url;
                    $userInfoServe.setUserInfo(response.object);
                    var userInfo = $userInfoServe.getUserInfo();
                    sessionStorage.setItem('wxLogin', 2);
                    if ( !userInfo.icon ) {
                        userImg = $rootScope.userImg = '././static/img/userhead.png';
                    }
                    else {
                        if(userInfo.icon.indexOf('http') !== -1){
                            userImg = $rootScope.userImg = userInfo.icon;
                        }else {
                            userImg = $rootScope.userImg = userInfo.url + userInfo.icon;
                        }
                    }
                    sessionStorage.setItem('userImg', userImg);
                    $state.go('home')
                }
                else {
                    $modalService.modalBox(response.message);
                }
            });
    }



}


angular
    .module('jibao')
    .controller('loginCtrl', loginCtrl);

