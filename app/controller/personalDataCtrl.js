/**
 * Created by Administrator on 2018/7/18.
 */
function personalDataCtrl ( $scope, $state, $rootScope, $userInfoServe, $modalService, loginOrRegist, $interval, $timeout, Upload, $loadingServe, $GetRequestUrl, $urlConfigService  ) {
    $rootScope.latestActivBtnArr = JSON.parse(sessionStorage.getItem('latestActivBtn'));
    var thirdpartyStatus = sessionStorage.getItem('thirdpartyStatus');
    var bindWeiBoSuccess = sessionStorage.getItem('bindWeiBoSuccess');
    var bindWeiXinSuccess = sessionStorage.getItem('bindWeiXinSuccess');
    var wxLogin = sessionStorage.getItem('wxLogin');
    var weiboLogin = sessionStorage.getItem('weiboLogin');
    var imgUrl;
    var mobile;
    var email;
    $rootScope.homeIndex = '';
    $scope.paracont = "获取验证码";
    var userInfo = $userInfoServe.getUserInfo();
    console.info(userInfo);
    var global = sessionStorage.getItem('global');
    if ( global ) {
        $rootScope.headerShowHide = true;
    }
    else {
        $rootScope.headerShowHide = false;
    }
    if ( userInfo.email ) {
        email = userInfo.email
    }
    else {
        email = '暂无信息,请补充完整';
        $scope.color = { 'color' : '#b5b5b5' }
    }
    if ( userInfo.mobile ) {
        mobile = userInfo.mobile.substr(0, 3) + "****" + userInfo.mobile.substr(7)
    }
    else {
        mobile = '';
    }
    if ( !userInfo.icon ) {
        imgUrl = '././static/img/userhead.png';
    }
    else {
        if ( wxLogin || weiboLogin) {
            if(userInfo.icon.indexOf('http') !== -1){
                imgUrl = userInfo.icon;
            }else {
                imgUrl = userInfo.url + userInfo.icon;
            }
        }
        else {
            imgUrl = userInfo.url + userInfo.icon;
        }
    }
    var photoUrl = ipUrl + '/user/uploadFile';
    $scope.userData = {
        email : email,
        icon : imgUrl,
        mobile : mobile,
        nickName : userInfo.nickName
    };
    var personInfo = $scope.personInfo = {
        url : {
            verifyUrl : ipUrl + '/user/getValidate',
            getRegisterCodeUrl : ipUrl + '/user/getRegisterCode',
            editPersonInfoUrl : ipUrl + '/user/modifyIconWithNickName',
            bindWeiUserUrl : ipUrl + '/user/bindWeiUserInfo',
            bindWXUserInfoUrl : ipUrl + '/user/bindWXUserInfo'
        },
        upLoadImg : '',
        releAccount : sessionStorage.getItem('releAccountIndex'),
        data : {
            nickName : '',
            icon : '',
            userUuid : userInfo.uuid
        },
        bindData : {
            uuid : userInfo.uuid,
            code : '',
            client_id : '',
            redirect_uri : '',
            client_secret : ''
        },
        bindWXData : {
            uuid : userInfo.uuid,
            code : ''
        },
        editAndShow : 1,
        EditPersonInfo : function () {
            this.editAndShow = 2;
        },
        Exit : function () {
            $rootScope.userImg = '././static/img/user.png';
            $userInfoServe.removeUserInfo();
            sessionStorage.clear();
            $state.go('login')
        },
        RelevWeibo : function ( num, bindName ) {
            sessionStorage.setItem('releAccount', 1002);
            sessionStorage.setItem('releAccountIndex', num);
            personInfo.releAccount = sessionStorage.getItem('releAccountIndex');
            if ( num === 1 ) {
                sessionStorage.removeItem('weixinBindName');
                sessionStorage.setItem('weiboBindName', bindName);
                var bindWeiBoSuccess = sessionStorage.getItem('bindWeiBoSuccess');
                if ( !bindWeiBoSuccess ) {
                    location.href = 'https://api.weibo.com/oauth2/authorize?client_id=' + $urlConfigService.loginWbKey + '&redirect_uri=' + $urlConfigService.loginWbUri
                }
                else {
                    $modalService.modalBox('微博已绑定');
                }
            }
            else if ( num === 2 ) {
                $modalService.modalBox('开发中');
            }
            else if ( num === 3 ) {
                sessionStorage.removeItem('weiboBindName', bindName);
                sessionStorage.setItem('weixinBindName', bindName);
                var bindWeiXinSuccess = sessionStorage.getItem('bindWeiXinSuccess');
                if ( !bindWeiXinSuccess ) {
                    location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + $urlConfigService.appid + '&redirect_uri=' + $urlConfigService.loginWeChatUri + '&response_type=code&scope=snsapi_login';
                }
                else {
                    $modalService.modalBox('微信已绑定');
                }
            }
        },
        //编辑资料
        SaveChanges : function () {
            if ( !personInfo.data.nickName ) {
                personInfo.data.nickName = $scope.userData.nickName;
                this.EditNickName();
            }
            else {
                this.EditNickName();
            }
        },
        EditNickName : function () {
            loginOrRegist.httpPostRequest(personInfo.url.editPersonInfoUrl, this.data)
                .then(function ( response ) {
                    console.info(response);
                    if ( response.code === 1 ) {
                        if ( personInfo.upLoadImg ) {
                            userInfo.icon = personInfo.upLoadImg;
                        }
                        else {
                            userInfo.icon = userInfo.icon;
                        }
                        $scope.userData.nickName = personInfo.data.nickName;
                        userInfo.nickName = personInfo.data.nickName;

                        $rootScope.userImg = $scope.userData.icon;
                        sessionStorage.setItem('userImg', $rootScope.userImg);
                        personInfo.editAndShow = 1;
                        $modalService.modalMsg('修改' + response.message);
                        $userInfoServe.setUserInfo(userInfo);
                    }
                    else {
                        $modalService.modalBox('姓名不能以非法字符开头，姓名只能为字母，数字，_或中文的混合，且长度4到20位')
                    }
                });
        },
        GoBackPrevPage : function () {
            this.editAndShow = 1;
            if ( !userInfo.icon ) {
                $scope.userData.icon = '././static/img/userhead.png';
            }
            else {
                if ( wxLogin || weiboLogin) {
                    if(userInfo.icon.indexOf('http') !== -1){
                        $scope.userData.icon = userInfo.icon;
                    }else {
                        $scope.userData.icon = userInfo.url + userInfo.icon;
                    }
                }
                else {
                    $scope.userData.icon = userInfo.url + userInfo.icon;
                }
            }
        },
        // 上传方法 uploadFiles
        uploadFiles : function ( file, errFiles ) {
            $loadingServe.loadingTips(1);
            $scope.errFile = errFiles && errFiles[ 0 ];
            if ( file ) {
                file.upload = Upload.upload({
                    url : photoUrl,
                    data : {
                        photoFile : file
                    }
                });
                file.upload.then(function ( res ) {
                    console.info('res', res)
                    $loadingServe.loadingTips(2);
                    if ( res.data.code === 1 ) {
                        weibo = true;
                        personInfo.data.icon = res.data.object.saveImage;
                        $scope.userData.icon = res.data.object.showImage;
                        personInfo.upLoadImg = res.data.object.saveImage;
                        // sessionStorage.setItem('imgUrls', res.data.object.showImage);
                        $modalService.modalMsg('上传' + res.data.message);
                    }
                    else {
                        $modalService.modalBox(res.data.message);
                    }
                });
            }
        }
    };

    var pramas = $GetRequestUrl.GetRequest();
    var reponsecode = pramas[ 'code' ];
    var weiboBindName = sessionStorage.getItem('weiboBindName');
    var weixinBindName = sessionStorage.getItem('weixinBindName');
    if ( reponsecode ) {
        if ( thirdpartyStatus && !bindWeiBoSuccess && weiboBindName) {
            personInfo.bindData.code = reponsecode;
            personInfo.bindData.client_id = $urlConfigService.loginWbKey;
            personInfo.bindData.client_secret = $urlConfigService.loginWbSecret;
            personInfo.bindData.redirect_uri = $urlConfigService.loginWbUri;
            personInfo.releAccount = 1;
            $loadingServe.loadingTips(1);
            loginOrRegist.httpPostRequest(personInfo.url.bindWeiUserUrl, personInfo.bindData)
                .then(function ( response ) {
                    $loadingServe.loadingTips(2);
                    console.info('关联微博', response);
                    if ( response.code === 1 ) {
                        sessionStorage.setItem('bindWeiBoSuccess', 1002);
                        $modalService.modalMsg('关联账号' + response.message);
                    }
                    else {
                        if(response.message !== 'null'){
                            $modalService.modalBox(response.message);
                        }
                    }
                });
        }
        else if ( thirdpartyStatus && !bindWeiXinSuccess && weixinBindName ) {
            personInfo.bindWXData.code = reponsecode;
            personInfo.releAccount = 3;
            $loadingServe.loadingTips(1);
            loginOrRegist.httpPostRequest(personInfo.url.bindWXUserInfoUrl, personInfo.bindWXData)
                .then(function ( response ) {
                    $loadingServe.loadingTips(2);
                    console.info('关联微信', response);
                    if ( response.code === 1 ) {
                        $modalService.modalMsg('关联账号' + response.message);
                        sessionStorage.setItem('bindWeiXinSuccess', 1002);
                    }
                    else {
                        if(response.message !== 'null'){
                            $modalService.modalBox(response.message);
                        }
                    }
                });
        }
    }


}
angular
    .module('jibao')
    .controller('personalDataCtrl', personalDataCtrl);

