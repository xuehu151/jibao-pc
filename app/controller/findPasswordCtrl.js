/**
 * Created by Administrator on 2018/7/16.
 */
function findPasswordCtrl ( $scope, $state, $modalService, loginOrRegist, $interval, $timeout, $loadingServe ) {
    $scope.paracont = "获取验证码";
    var second = 59,
        timePromise = undefined;
    var canClick = true;
    var findPass = $scope.findPass = {
        url : {
            verifyUrl : ipUrl + '/user/getValidate',
            getRegisterCodeUrl : ipUrl + '/user/getRegisterCode',
            verificationCodeUrl : ipUrl + '/user/verificationCode'
        },
        btnDisabled : false,
        current : 1,
        uuid : '',
        registerId : '',
        tipInfo : '请输入正确的手机号',
        data : {
            timestamp : '',
            effective : '',
            registerId : '',
            regType : 2
        },
        verifyCode : {
            registerId : '',
            code : ''
        },
        phoneAndEmailFind : function ( num ) {
            findPass.btnDisabled = false;
            canClick = true;
            $scope.paracont = "获取验证码";
            $interval.cancel(timePromise);
            findPass.data.registerId = '';
            second = 59;
            if ( num === 1 ) {
                findPass.current = 2;
                this.tipInfo = '请输入正确的邮箱号';
            }
            else if ( num === 2 ) {
                findPass.current = 1;
                this.tipInfo = '请输入正确的手机号';
            }
        },
        goBack : function () {
            $state.go('login')
        },
        getCode : function () {
            if ( !findPass.data.registerId ) {
                $modalService.modalBox(this.tipInfo);
            }
            else {
                $loadingServe.loadingTips(1);
                if ( second === 59 ) {
                    if ( !findPass.data.timestamp && !findPass.data.effective ) {
                        loginOrRegist.httpPostRequest(findPass.url.verifyUrl)
                            .then(function ( response ) {
                                console.info('1122', response);
                                if ( response.code === 1 ) {
                                    findPass.data.timestamp = response.object.timestamp;
                                    findPass.data.effective = response.object.effective;
                                    loginOrRegist.httpPostRequest(findPass.url.getRegisterCodeUrl, findPass.data)
                                        .then(function ( response ) {
                                            console.info('**', response);
                                            if ( response.code === 1 ) {
                                                $loadingServe.loadingTips(2);
                                                $modalService.modalBox('验证码发送' + response.message);
                                                findPass.uuid = response.object;
                                                if ( canClick ) {
                                                    timePromise = $interval(function () {
                                                        if ( second <= 0 ) {
                                                            $interval.cancel(timePromise);
                                                            timePromise = undefined;
                                                            canClick = true;
                                                            second = 59;
                                                            findPass.btnDisabled = false;
                                                            $scope.paracont = "重发验证码";
                                                        }
                                                        else {
                                                            findPass.btnDisabled = true;
                                                            $scope.paracont = second + "s后重发";
                                                            second--;
                                                            canClick = false;
                                                        }
                                                    }, 1000, 100);
                                                }
                                                findPass.data.timestamp = '';
                                                findPass.data.effective = '';
                                            }
                                            else {
                                                $loadingServe.loadingTips(2);
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
                    findPass.btnDisabled = true;
                }

            }
        },
        NextStep : function ( curr ) {
            console.info('curr', curr);
            console.info('findPass.data', findPass.data);
            var info = {
                uuid : findPass.uuid,
                curr : curr
            };
            if ( !findPass.data.registerId ) {
                $modalService.modalBox(this.tipInfo);
            }
            else if ( !findPass.verifyCode.code ) {
                $modalService.modalBox('请输入验证码');
            }
            else {
                findPass.verifyCode.registerId = findPass.data.registerId;
                $loadingServe.loadingTips(1);
                sessionStorage.setItem('current', JSON.stringify(info));
                loginOrRegist.httpPostRequest(findPass.url.verificationCodeUrl, findPass.verifyCode)
                    .then(function ( response ) {
                        $loadingServe.loadingTips(2);
                        console.info('++++++++++++++', response);
                        if ( response.code === 1 ) {
                            $state.go('NextStepOpera');
                        }
                        else {
                            findPass.verifyCode.code = '';
                            $modalService.modalBox(response.message);
                        }
                    });
            }
        }
    }
}

angular
    .module('jibao')
    .controller('findPasswordCtrl', findPasswordCtrl);
