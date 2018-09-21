/**
 * Created by Administrator on 2018/7/20.
 */
function surveyCtrl ( $scope, $state, $rootScope, $userInfoServe, $modalService, loginOrRegist, $timeout ) {
    $rootScope.homeIndex = '';
    $rootScope.headerShowHide = false;
    var getQuestionUrl = ipUrl + '/question/getQuestion';
    var content = JSON.parse(sessionStorage.getItem('content'));
    var userInfo = $userInfoServe.getUserInfo();
    var contentId = '';
    var allList = '';
    var str = '';
    var arr = [];
    var data = {
        uuid : content.content
    };
    if(userInfo){
        userUuid = userInfo.uuid;
        loginOrRegist.httpPostRequest(getQuestionUrl, data)
            .then(function ( response ) {
                console.info(response);
                if ( response.code === 1 ) {
                    var len = response.object.content;
                    allList = len;
                    for(var i = 0; i < len.length; i++){
                        for(var  j = 0; j < len[i].contentList.length; j++){
                            len[i].contentList[j].check = false;
                        }
                    }
                    $scope.survey = {
                        title : response.object.title,
                        content : response.object.content
                    }
                }
                else {
                    $modalService.modalConfirm(response.message, '请重新发布问卷?', $state, 'home');
                }
            });
    }
    else {
        userUuid = '';
        $modalService.modalConfirm('您还未登录，请先登录', '现在登录?', $state, 'login');
    }

    var quesSurvey = $scope.quesSurvey  = {
        url : {
            submitAnswerUrl : ipUrl + '/question/submitAnswer'
        },
        submitData : {
            uuid : content.content,
            userUuid : userUuid,
            contentIds : ''
        },
        Pitch : function ( statu, contentList ) {
            contentList.forEach(function ( item, idx ) {
                item.check = false;
            });
            statu.check = true;
        },
        SubmitQues : function ( num ) {
            for ( var i = 0; i < allList.length; i++ ) {
                for ( var j = 0; j < allList[ i ].contentList.length; j++ ) {
                    if ( allList[ i ].contentList[ j ].check) {
                        arr.push(allList[ i ].contentList[ j ].value);
                        contentId += allList[ i ].contentList[ j ].value + ',';
                        str = (contentId.substring(contentId.length - 1) === ',') ? contentId.substring(0, contentId.length - 1) : contentId;
                    }
                }
            }
            quesSurvey.submitData.contentIds = str;
            if(arr.length !== allList.length){
                $modalService.modalBoxError('还有未填写的项目,请补充完整', 5, $timeout);
            }
            else {
                loginOrRegist.httpPostRequest(quesSurvey.url.submitAnswerUrl, this.submitData)
                    .then(function ( response ) {
                        console.info(response);
                        if ( response.code === 1 ) {
                            $modalService.modalConfirm('问卷提交' + response.message, '继续浏览其他内容', $state, 'home');
                        }
                        else {
                            $modalService.modalBox(response.message);
                        }
                    });
            }

        }

    };


    $(document).ready(function(){
        $(".jb_Survey_content").niceScroll({
            cursorborder : "",
            cursorcolor : "rgba(0,0,0,0)",
            boxzoom : true
        });
    });


}

angular
    .module('jibao')
    .controller('surveyCtrl', surveyCtrl);

