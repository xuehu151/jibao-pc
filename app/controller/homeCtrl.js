/**
 * Created by Administrator on 2018/7/13.
 */

function homeCtrl ( $scope, $rootScope, $state, loginOrRegist, $modalService, $interval, $configService, $GetRequestUrl, $stateParams ) {
    var wxLogin = sessionStorage.getItem('wxLogin');
    var weiboLogin = sessionStorage.getItem('weiboLogin');
    $rootScope.homeIndex = 1;
    $rootScope.headerShowHide = false;
    sessionStorage.removeItem('global');
    //轮播左边的配置文件
    var carouselConfig = $configService.jsonData;
    var getAllAdvertUrl = ipUrl + '/ad/getAll';
    var latestActivBtn = [];
    var pageTime = null;
    loginOrRegist.httpPostRequest(getAllAdvertUrl)
        .then(function ( response ) {
            $rootScope.carousel = [];
            if ( response.code === 1 ) {
                response.object.forEach(function ( item, idx ) {
                    item.imgPc = response.map.url + item.imgPc;
                    if ( item.type === 1 && item.linkType !== 3) {
                        item.configXml = carouselConfig[idx];
                        $rootScope.carousel.push(item);
                    }
                    else if(item.linkType === 3){
                        $rootScope.headerShowHide = true;
                       var global = true;
                        sessionStorage.setItem('global',global);
                        latestActivBtn.push(item);
                        sessionStorage.setItem('latestActivBtn',JSON.stringify(latestActivBtn))
                    }
                });

                if ( $rootScope.carousel.length > 6 ) {
                    $rootScope.carousel.length = 6;
                }

                var mySwiper = new Swiper('.swiper-container', {   //重置轮播加载方法
                    direction: 'horizontal',
                    speed : 1000,
                    pagination : {
                        el : '.swiper-pagination',
                        clickable : true
                    },
                    navigation : {
                        nextEl : '.next',
                        prevEl : '.prev'
                    },
                    slidesPerView : 1,
                    paginationClickable : true,
                    spaceBetween : 20,
                    autoplay : {
                        delay : 4000,
                        disableOnInteraction : false,
                        waitForTransition: false
                    },
                    keyboardControl : true,
                    observer : true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents : true,//修改swiper的父元素时，自动初始化swiper
                    on : {
                        init : function () { //Swiper2.x的初始化是onFirstInit
                            swiperAnimateCache(this); //隐藏动画元素
                            setTimeout(function(){ //2s后开始运行动画（移动端总是没加载完图片就开始动画了
                                swiperAnimate(mySwiper); //初始化完成开始动画
                            },500)
                    },
                        slideChangeTransitionEnd : function () {
                            swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
                        },
                        autoplay : function () {
                            clearInterval(pageTime);
                            pageTime = setInterval(function () {
                                $(".page").css({
                                    animation : 'fadeIn 5s linear 0s infinite'
                                });
                            }, 0);
                        }
                    }
            });
                var timerIndex = setInterval(function () {
                    $scope.$apply(function () {
                       var pageIndex = $scope.pageIndex = mySwiper.realIndex;
                    });
                }, 800);
            }
            else {
                $modalService.modalConfirm(response.message, '现在登录', $state, 'login');
            }
        });
    $rootScope.latestActivBtnArr = JSON.parse(sessionStorage.getItem('latestActivBtn'));

    var homeInfo = $scope.homeInfo = {
        CarouselLink : function ( content ) {
            sessionStorage.setItem('content', JSON.stringify(content));
            if ( content.linkType === 0 ) {
                window.open(content.content, "_blank");
            }
            else if ( content.linkType === 1 ) {
                $state.go('newArticle');
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
    };

    var pramas = $GetRequestUrl.GetRequest();
    var reponsecode = pramas[ 'code' ];
    var releAccount = sessionStorage.getItem('releAccount');
    if ( reponsecode && !weiboLogin && !releAccount && !wxLogin && $rootScope.activeIndex !== 1) {
        $state.go('login')
    }

    if(releAccount ) {
        sessionStorage.setItem('thirdpartyStatus',1001);
        $state.go('personalData')
    }

    var timer = null;
    var times = null

    function startMove () {
        clearInterval(timer);
        var oYellowBg = document.getElementById('jb_yellow');

        oYellowBg.style.width = 0 + 'px';
        oYellowBg.style.left = 480 + 'px';

        timer = setInterval(function () {
            var speed_1 = 10;
            var yellowBg = parseInt(oYellowBg.style.width);
            if ( yellowBg >= 300 ) {
                clearInterval(timer)
            }
            else {
                oYellowBg.style.width = parseInt(oYellowBg.style.width) + speed_1 + "px";
            }
        }, 50);
        times = setInterval(function () {
            var speed_2 = 2;
            var yellowLeft = parseInt(oYellowBg.style.left);
            if ( yellowLeft <= 420 ) {
                clearInterval(times)
            }
            else {
                oYellowBg.style.left = oYellowBg.offsetLeft - speed_2 + "px";
            }
        }, 30);
    }
    startMove();

}

function CarouselContentFilter (  ) {
    return function (str) {
        if(str){
            var carContent = '';
            if(str.length >= 60){
                str.length = 60;
                carContent = str.substring(0,60) + ' ...';
            }
            else {
                carContent = str
            }
            return carContent
        }
    }
}


angular
    .module('jibao')
    .controller('homeCtrl', homeCtrl)
    .filter('CarouselContentFilter',CarouselContentFilter);

