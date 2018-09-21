//List Controller
function registerSuccessCtrl( $scope, $state, $modalService, $userInfoServe, Upload, loginOrRegist, $loadingServe, $rootScope ) {
    sessionStorage.removeItem('imgUrls');
    $rootScope.headerShowHide = false;
    var imgUrl;
    var photoUrl = ipUrl + '/user/uploadFile';
    var userInfo = $userInfoServe.getUserInfo();
    var imgSrc = sessionStorage.getItem('imgUrls');

    if ( !userInfo.icon && !imgSrc) {
        imgUrl = '././static/img/userhead.png';
    }
    else {
        imgUrl = imgSrc;
    }
    console.info('*****', userInfo);
    console.info('imgSrc', imgSrc);
    var registSucc = $scope.registSucc = {
        url: {
            editPersonInfoUrl : ipUrl + '/user/modifyIconWithNickName'
        },
        succData : {
            icon : imgUrl,
            nickName : userInfo.nickName
        },
        data : {
            nickName : '',
            icon : '',
            userUuid : userInfo.uuid
        },
        ResFinish : function () {//完成
            if ( !registSucc.data.nickName ) {
                registSucc.data.nickName = userInfo.nickName;
                this.SureValue();
            }
            else {
                this.SureValue();
            }
        },
        SureValue : function (  ) {
            loginOrRegist.httpPostRequest(registSucc.url.editPersonInfoUrl, this.data)
                .then(function ( response ) {
                    console.info('+++++++++++',response);
                    if ( response.code === 1 ) {
                        $modalService.modalMsg('保存' + response.message);
                        $userInfoServe.removeUserInfo();
                        $state.go('login')
                    }
                    else {
                        $modalService.modalBox(response.message)
                    }
                });
        },
        JumpOver : function () {//跳过
            $state.go('home')
        },
        ChangePhoto : function (file, errFiles) {//更换头像
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
                    $loadingServe.loadingTips(2);
                    if(res.data.code === 1){
                        registSucc.data.icon = res.data.object.saveImage;
                        registSucc.succData.icon = res.data.object.showImage;
                        sessionStorage.setItem('imgUrls',res.data.object.showImage);
                        $modalService.modalBox('上传' + res.data.message);
                    }
                    else {
                        $modalService.modalBox(res.data.message);
                    }
                });
            }
        }
    }


}

angular
    .module('jibao')
    .controller('registerSuccessCtrl', registerSuccessCtrl);
