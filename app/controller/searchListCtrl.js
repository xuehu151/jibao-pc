/**
 * Created by Administrator on 2018/7/20.
 */
function searchListCtrl ( $scope, $userInfoServe, $rootScope, loginOrRegist, $modalService, $state ) {
    $rootScope.latestActivBtnArr = JSON.parse(sessionStorage.getItem('latestActivBtn'));
    var userInfo = $userInfoServe.getUserInfo();
    $scope.contentList = [];
    var contentList_1 = [];
    var contentList_2 = [];
    var contentList_3 = [];
    var hasmore = true;
    $rootScope.homeIndex = '';
    var global = sessionStorage.getItem('global');
    if ( global ) {
        $rootScope.headerShowHide = true;
    }
    else {
        $rootScope.headerShowHide = false;
    }

    $rootScope.iptWidth = {
        'width' : '150px',
        'background' : '#6e7385',
        'z-index' : '1',
        'display' : 'block',
        'right' : '20%'
    };
    $rootScope.formWidth = {
        'width' : '300px'
    };
    $rootScope.hideAndShow = {
        'display' : 'block'
    };
    $rootScope.borderRad = {
        'border-radius' : '0 50% 50% 0'
    };
    var searchList = $scope.searchList = {
        url : {
            searchContentUrl : ipUrl + '/content/searchContent'
        },
        GoToDetails : function ( search ) {
            sessionStorage.setItem('imgList', JSON.stringify(search));
            $state.go('newArticle');
        }
    };

    $rootScope.SearchList = function () {
        contentList_1 = [];
        contentList_2 = [];
        contentList_3 = [];
        $state.go('searchList');
        searchListFn(searchList.url.searchContentUrl, $rootScope.data);
    };

    $scope.loadMore = function ()  {//分页加载
        if ( hasmore ) {
            $rootScope.data.nextPage++;
            searchListFn(searchList.url.searchContentUrl, $rootScope.data);
        }
    };

    searchListFn(searchList.url.searchContentUrl, $rootScope.data);//默认搜索全部
    function searchListFn ( url, data ) {
        $scope.contentList = [];
        loginOrRegist.httpPostRequest(url, data)
            .then(function ( response ) {
                console.info('response', response);
                if ( response.code === 1 ) {
                    var len = response.object.content;
                    if ( len.length ) {
                        hasmore = true;
                    }
                    else {
                        hasmore = false;
                    }
                    for ( var i = 0; i < len.length; i++ ) {
                        response.object.content[ i ].thumbnailImagePc = response.map.url + response.object.content[ i ].thumbnailImagePc;
                        if ( i % 3 === 0 ) {
                            contentList_1.push(len[ i ]);
                        }
                        else if ( i % 3 === 1 ) {
                            contentList_2.push(len[ i ]);
                        }
                        else if ( i % 3 === 2 ) {
                            contentList_3.push(len[ i ]);
                        }
                    }
                    console.info('data3', $scope.contentList);
                }
                else {
                    $modalService.modalBox('失败' + response.message)
                }
            });
        $scope.contentList.push(contentList_1);
        $scope.contentList.push(contentList_2);
        $scope.contentList.push(contentList_3);
    }

    $(document).ready(function () {
        $(".search_content").niceScroll();
    });

}


angular
    .module('jibao')
    .controller('searchListCtrl', searchListCtrl);
