/**
 * Created by Administrator on 2018/7/14.
 */
function articleCtrl ( $scope, $state, $rootScope, loginOrRegist, $modalService, $timeout ) {
    $rootScope.latestActivBtnArr = JSON.parse(sessionStorage.getItem('latestActivBtn'));
    $rootScope.homeIndex = 2;
    var pageSize = 20;
    var nextPage = 0;
    var itemsNum;
    var hasmore = true;
    var getAllThemeUrl = ipUrl + '/content/getAllTheme';
    loginOrRegist.httpPostRequest(getAllThemeUrl)
        .then(function ( response ) {
            console.info(response);
            if ( response.code === 1 ) {
                $scope.navLinst = response.object;
                article.lastNewArticle = response.object[ 0 ].name;
                clickVerticalNav(0, response.object[ 0 ]);
            }
            else {
                $modalService.modalBox(response.message);
            }
        });
    var global = sessionStorage.getItem('global');
    if ( global ) {
        $rootScope.headerShowHide = true;
    }
    else {
        $rootScope.headerShowHide = false;
    }
    var article = $scope.article = {
        url : {
            getContentListUrl : ipUrl + '/content/getContentListByThemeUuid'
        },
        artIndex : 0,
        listIndex : '',
        listContentOdd : [],
        listContentEven : [],
        lastNewArticle : '',
        data : {
            themeUuid : '',
            nextPage : nextPage,
            pageSize : pageSize
        },
        ClickVerticalNav : function ( idx, listitem ) {
            this.lastNewArticle = listitem.name;
            article.listContentEven = [];
            article.listContentOdd = [];
            itemsNum = idx;
            clickVerticalNav(idx, listitem);
            AnimationList('itemOdd', '44vw', '14.1vw');
            AnimationList('itemEven', '40vw' , '0.6vw');
        },
        NewArticle : function ( imgList ) {
            console.info(imgList);
            sessionStorage.setItem('imgList', JSON.stringify(imgList));
            if ( imgList ) {
                $state.go('newArticle');
            }
        }
    };

    $scope.loadMore = function () {//分页加载
        if ( hasmore ) {
            article.data.nextPage++;
            clickVerticalNav(itemsNum, article.data);
        }
    };

    function clickVerticalNav ( idx, listitem ) {
        article.artIndex = idx;
        article.data.themeUuid = listitem.uuid;
        loginOrRegist.httpPostRequest(article.url.getContentListUrl, article.data)
            .then(function ( response ) {
                console.info(response);
                if ( response.code === 1 ) {
                    var len = response.object.content;
                    if ( len.length ) {
                        hasmore = true;
                    }
                    else {
                        hasmore = false;
                    }
                    for ( var i = 0; i < len.length; i++ ) {
                        len[ i ].thumbnailImagePc = response.map.url + len[ i ].thumbnailImagePc;
                        if ( i % 2 === 0 ) {
                            article.listContentEven.push(response.object.content[ i ]);
                        }
                        else {
                            article.listContentOdd.push(response.object.content[ i ]);
                        }
                    }
                }
                else {
                    $modalService.modalBox(response.message);
                }
            });
    }
    AnimationList('itemOdd', '44vw', '14.1vw');
    AnimationList('itemEven', '40vw' , '0.6vw');

    function AnimationList ( id, initTop, target ) {
        var oDiv = document.getElementById(id);
        var timer = null;
        var speed = 0;
        clearInterval(timer);
        oDiv.style.top = initTop;
        timer = setInterval(function () {
            oDiv.style.top = parseInt(initTop) - speed + 'vw';
            speed += .5;
            if ( parseInt(oDiv.style.top) <= parseInt(target) ) {
                oDiv.style.top = target;
                clearInterval(timer);
            }
        }, 10);
    }



}

angular
    .module('jibao')
    .controller('articleCtrl', articleCtrl);

