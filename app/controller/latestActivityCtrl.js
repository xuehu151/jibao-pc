/**
 * Created by Administrator on 2018/7/15.
 */

function latestActivityCtrl ( $scope, $state, $userInfoServe, $modalService, $interval, $timeout, loginOrRegist, $sce, $rootScope, $loadingServe ) {
    $rootScope.headerShowHide = false;
    $rootScope.homeIndex = '';
    var content = JSON.parse(sessionStorage.getItem('content'));
    $scope.paracont = "获取验证码";
    var second = 59,
        timePromise = undefined;
    var canClick = true;
    var userUuid = '';
    var userInfo = $userInfoServe.getUserInfo();
    var getPublishActUrl = ipUrl + '/act/getPublishAct';
    var data = {
        uuid : content.content
    };
    if ( userInfo ) {
        userUuid = userInfo.uuid;
    }
    else {
        userUuid = '';
    }
    loginOrRegist.httpPostRequest(getPublishActUrl, data)
        .then(function ( response ) {
            console.info(response);
            if ( response.code === 1 ) {
                response.object.thumbnailImagePc = response.map.url + response.object.thumbnailImagePc;
                $scope.lastActi = {
                    title : response.object.title,
                    infoContent : $sce.trustAsHtml(response.object.infoContent),
                    thumbnailImagePc : response.object.thumbnailImagePc,
                    uuid : response.object.uuid
                };
            }
            else {
                $modalService.modalConfirm(response.message + '返回上一页', '重新选择活动查看', $state, 'home');
            }
        });

    var lastArticle = $scope.lastArticle = {
        url : {
            verifyUrl : ipUrl + '/user/getValidate',
            getRegisterCodeUrl : ipUrl + '/user/getRegisterCode',
            submitSignUpUrl : ipUrl + '/act/submitSignUp'
        },
        data : {
            userName : '',
            mobile : '',
            code : '',
            activityUuid : content.content,
            userUuid : userUuid
        },
        codeData : {
            registerId : '',
            regType : 0,
            timestamp : '',
            effective : ''
        },
        btnDisabled : false,
        lastArticCurr : 1,
        TrafficRank : '立刻报名',
        SignupOnce : function ( num ) {
            if ( !userInfo ) {
                $modalService.modalConfirm('您还未登录，请先登录!', '现在登录!', $state, 'login');
            }
            else {
                if ( num === 1 ) {
                    this.lastArticCurr = 2;
                    this.TrafficRank = ' 提交 ';
                }
                else if ( num === 2 ) {
                    if ( !lastArticle.data.userName ) {
                        $modalService.modalBox('请输入昵称!');
                    }
                    else if ( !lastArticle.data.mobile ) {
                        $modalService.modalBox('请输入正确的手机号!');
                    }
                    else if ( !lastArticle.data.code ) {
                        $modalService.modalBox('请输入验证码!');
                    }
                    else if ( !lastArticle.data.activityUuid ) {
                        $modalService.modalConfirm('活动信息获取失败!', '重新获取', $state, 'home');
                    }
                    else {
                        loginOrRegist.httpPostRequest(lastArticle.url.submitSignUpUrl, lastArticle.data)
                            .then(function ( response ) {
                                console.info(response);
                                if ( response.code === 1 ) {
                                    lastArticle.lastArticCurr = 1;
                                    $modalService.modalMsg('报名' + response.message);
                                }
                                else {
                                    $modalService.modalBox(response.message);
                                }
                                lastArticle.data.mobile = '';
                                lastArticle.data.code = ''
                            });
                    }
                }
            }
        },
        getCode : function () {
            if ( !lastArticle.data.mobile ) {
                $modalService.modalBox('请输入正确的手机号');
            }
            else {
                $loadingServe.loadingTips(1);
                lastArticle.codeData.registerId = lastArticle.data.mobile;
                if(second === 59){
                    if ( !lastArticle.codeData.timestamp && !lastArticle.codeData.effective ) {
                        loginOrRegist.httpPostRequest(lastArticle.url.verifyUrl)
                            .then(function ( response ) {
                                console.info(response);
                                if ( response.code === 1 ) {
                                    lastArticle.codeData.timestamp = response.object.timestamp;
                                    lastArticle.codeData.effective = response.object.effective;
                                    loginOrRegist.httpPostRequest(lastArticle.url.getRegisterCodeUrl, lastArticle.codeData)
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
                                                            lastArticle.btnDisabled = false;
                                                            $scope.paracont = "重发验证码";
                                                        }
                                                        else {
                                                            lastArticle.btnDisabled = true;
                                                            $scope.paracont = second + "s后重发";
                                                            second--;
                                                            canClick = false;
                                                        }
                                                    }, 1000, 100);
                                                }
                                                lastArticle.codeData.timestamp = '';
                                                lastArticle.codeData.effective = '';
                                            }
                                            else {
                                                $modalService.modalBoxError(response.message, 5, $timeout);
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
                    lastArticle.btnDisabled = true;
                }

            }
        }
    };

    $(document).ready(function(){
        $(".viewboxList").niceScroll({
                cursorborder : "",
                cursorcolor : "rgba(0,0,0,0)",
                boxzoom : true
            });
    });

}


angular
    .module('jibao')
    .controller('latestActivityCtrl', latestActivityCtrl);

