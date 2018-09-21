/**
 * Created by Administrator on 2018/7/14.
 */

function headerCtrl ( $scope, $state, $location, $rootScope, $userInfoServe, $modalService, loginOrRegist ) {
    var userInfo = $userInfoServe.getUserInfo();
    var nextPage = 0;
    var pageSize = 15;
    $rootScope.headerShowHide = false;
    $rootScope.data = {
        title : '',
        themeUuid : '',
        nextPage : nextPage,
        pageSize : pageSize
    };
    console.info('headerUserInfo',userInfo);
    var userImg = sessionStorage.getItem('userImg');
    if(!userInfo && !userImg){
        $rootScope.userImg = '././static/img/user.png';
    }
    else {
        $rootScope.userImg = userImg;
    }

    if ( $location.path() === '/login' ) {
        $rootScope.homeIndex = '';
    }
    else if ( $location.path() === '/home' ) {
        $rootScope.homeIndex = 1;
    }
    else if ( $location.path() === '/article' ) {
        $rootScope.homeIndex = 2;
    }
    else if ( $location.path() === '/aboutUs' ) {
        $rootScope.homeIndex = 3;
    }

    var getAllThemeUrl = ipUrl + '/content/getAllTheme';
    loginOrRegist.httpPostRequest(getAllThemeUrl)
        .then(function ( response ) {
            if ( response.code === 1 ) {
                $rootScope.searchList = response.object;
            }
            else {
                $modalService.modalBox(response.message);
            }
        });
    $rootScope.SearchList = function () {
        $state.go('searchList');
    };

   /* $rootScope.LoseFocus = function (  ) {
        $rootScope.iptWidth = {
            'width' : '0',
            'z-index' : '1',
            'display' : 'block',
            'right' : '20%'
        };
        $rootScope.formWidth = {
            'width' : '0'
        };
        $rootScope.hideAndShow = {
            'display' : 'none'
        };
        $rootScope.borderRad = {
           'background': '#f0f',
            'border-radius' : '50%'
        };
    };*/

    var headData = $scope.headData = {
        url : {},
        contentInfo : '',
        PersonalData : function ( num ) {
            var userInfo = $userInfoServe.getUserInfo();
            if ( num === 1 ) {
                $state.go('searchList')
            }
            else if ( num === 2 ) {
                if ( !userInfo ) {
                    $state.go('login');
                }
                else {
                    $state.go('personalData');
                }
            }
        },
        clickNav : function ( ele ) {
            $rootScope.homeIndex = ele;
            if ( ele === 1 ) {
                $rootScope.activeIndex = 1;
                $state.go('home');
            }
            else if ( ele === 2 ) {
                $state.go('article');
            }
            else if ( ele === 3 ) {
                $state.go('aboutUs');
            }
        },
        GoToSearchList : function () {
            $state.go('searchList')
        },
        ChangeValue : function ( val ) {
            if(val){
                $rootScope.data.themeUuid = val.uuid;
            }else {
                $rootScope.data.themeUuid = '';
            }
        }
    };

    $rootScope.CarouselLink = function ( content ) {
        console.info(content);
        sessionStorage.setItem('content', JSON.stringify(content));
        if ( content.linkType === 0 ) {
            window.open(content.content, "_blank");
        }
        else if ( content.linkType === 1 ) {
            $state.go('latestActivity');
        }
        else if ( content.linkType === 2 ) {
            $state.go('Survey');
        }
        else if ( content.linkType === 3 ) {
            $state.go('latestActivity');
        }
        else {
            // $modalService.modalBox('此链接为' + contentInfo);
        }
    }


}

angular
    .module('jibao')
    .controller('headerCtrl', headerCtrl);

