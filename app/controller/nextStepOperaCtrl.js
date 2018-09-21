/**
 * Created by Administrator on 2018/7/16.
 */
function nextStepOperaCtrl ( $scope, $modalService, loginOrRegist, $state, $loadingServe, $rootScope, $userInfoServe ) {
    $rootScope.headerShowHide = false;
    var current = JSON.parse(sessionStorage.getItem('current'));
    console.info(current);
    var nextStep = $scope.nextStep = {
        url : {
            changePWDUrl : ipUrl + '/user/changePWD'
        },
        current : current.curr,
        text : '重置密码',
        rePw : '',
        data : {
            uuid : current.uuid,
            pw : ''
        },
        Finished : function () {
            console.info(nextStep.data.pw);
            if ( !nextStep.data.pw || nextStep.data.pw.length < 8 ) {
                $modalService.modalBox('请输入8-12数字、字母组成的密码');
            }
            else if ( !nextStep.rePw ) {
                $modalService.modalBox('请输入再次输入密码');
            }
            else if ( nextStep.data.pw != nextStep.rePw ) {
                $modalService.modalBox('两次密码不一致');
            }
            else {
                $loadingServe.loadingTips(1);
                loginOrRegist.httpPostRequest(nextStep.url.changePWDUrl, nextStep.data)
                    .then(function ( response ) {
                        $loadingServe.loadingTips(2);
                        console.info('*+++*', response);
                        if ( response.code === 1 ) {
                            nextStep.data.pw = '';
                            nextStep.rePw = '';
                            $modalService.modalMsg('重置密码' + response.message);
                            $userInfoServe.removeUserInfo();
                            $state.go('login')
                        }
                        else {
                            $modalService.modalBox(response.message);
                        }
                    });
            }
        },
        goBack : function () {
            $state.go('findPassword')
        }

    };
    if ( nextStep.current.curr === '2' ) {
        nextStep.text = '';
    }


}

angular
    .module('jibao')
    .controller('nextStepOperaCtrl', nextStepOperaCtrl);
