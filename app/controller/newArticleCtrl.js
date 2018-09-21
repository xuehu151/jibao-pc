/**
 * Created by Administrator on 2018/7/15.
 */
function newArticleCtrl ( $scope, $state, $rootScope, loginOrRegist, $modalService, $sce, $userInfoServe, $timeout, $longAgoService ) {
    $rootScope.homeIndex = 2;
    $rootScope.headerShowHide = false;
    var imgList = JSON.parse(sessionStorage.getItem('imgList'));
    var content = JSON.parse(sessionStorage.getItem('content'));
    var ContentByUuidUrl = ipUrl + '/content/getInfoContentByUuid';
    var userInfo = $userInfoServe.getUserInfo();
    var contentUuid = '';
    var userUuid = '';
    var publish = 1; //0=未上线,1=已经上线
    var newArti = '';
    console.info('imgList',imgList)
    console.info('content',content)

    if(imgList){
        newArti =  imgList.uuid;
    }
    else {
        newArti =  content.content;
    }
    var data = {
        contentUuid : newArti,
        publish : publish
    };
    if ( userInfo ) {
        userUuid = userInfo.uuid;
    }
    else {
        userUuid = '';
    }
    CommentItem();
    // console.info('data',data)
    function CommentItem () {
        loginOrRegist.httpPostRequest(ContentByUuidUrl, data)
            .then(function ( response ) {
                console.info(response);
                if ( response.code === 1 ) {
                    response.object.bannerImagePc = response.map.url + response.object.bannerImagePc;
                    for ( var i = 0; len = response.object.commentList.content, i < len.length; i++ ) {
                        var timestamp1 = Date.parse(len[ i ].commentDate.replace(/-/g, "/"));
                        len[ i ].commentDate = $longAgoService.timeago(timestamp1);
                        len[ i ].icon = response.map.url + len[ i ].icon;
                    }
                    contentUuid = response.object.uuid;
                    response.object.commentList.content.forEach(function ( item, index ) {
                        lastIcon = item.icon.substr(item.icon.lastIndexOf('\/') + 1);
                        if ( lastIcon === 'null' ) {
                            item.icon = '././static/img/userhead.png';
                        }
                    });
                    $scope.contentInfo = {
                        title : response.object.title,
                        tagName : response.object.tagName,
                        createTime : response.object.createTime,
                        content : $sce.trustAsHtml(response.object.content),
                        commentCount : response.object.commentCount,
                        commentList : response.object.commentList,
                        bannerImagePc : response.object.bannerImagePc,
                        commentOpen : response.object.commentOpen
                    };
                    //console.info($scope.contentInfo)
                }
                else {
                    $modalService.modalBox(response.message);
                }
            });
    }

    var newArticle = $scope.newArticle = {
        url : {
            commentInfoUrl : ipUrl + '/content/commentInfo'
        },
        ViewComment : '查看评论',
        showHide : 1,
        data : {
            contentUuid : '',
            userUuid : userUuid,
            commentContent : ''
        },
        ViewComments : function ( num, commentOpen ) {
            if(commentOpen === 0){
                $modalService.modalBox('此内容暂时不能评论');
            }else {
                if ( num === 1 ) {
                    this.showHide = 2;
                    $scope.showHide = num;
                    this.ViewComment = '关闭评论';
                }
                else if ( num === 2 ) {
                    this.showHide = 1;
                    $scope.showHide = num;
                    this.ViewComment = '查看评论';
                }
            }
        },
        GoBackPrev : function () {
            history.go(-1);
        },
        Publish : function () {
            if(newArticle.data.commentContent.length >= 70){
                $modalService.modalBox('评论字数不能超过70个字符');
            }
            else {
                this.data.contentUuid = contentUuid;
                loginOrRegist.httpPostRequest(newArticle.url.commentInfoUrl, this.data)
                    .then(function ( response ) {
                        if ( response.code === 1 ) {
                            CommentItem();
                            newArticle.data.commentContent = '';
                            $modalService.modalBox('评论提交' + response.message);
                        }
                        else {
                            $modalService.modalBox(response.message);
                        }
                    });
            }
        }
    };

    $(document).ready(function(){
        $(".viewbox").niceScroll({ cursorborder : "", cursorcolor : "rgba(0,0,0,0)", boxzoom : true });
    });



}
angular.module('jibao')
    .controller('newArticleCtrl', newArticleCtrl);
