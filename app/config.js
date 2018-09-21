/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider) {

/*    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/dashboards/dashboard_1");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });*/

    $urlRouterProvider.when('', 'home');

    $stateProvider
        .state('login', {
            url: "/login",
            params : {'weibo' : null},
            templateUrl: "views/login/login.html",
            controller : loginCtrl
        })

        .state('registerSuccess', {
            url: "/registerSuccess",
            templateUrl: "views/login/registerSuccess.html",
            controller : registerSuccessCtrl
        })

        .state('findPassword', {
            url: "/findPassword",
            templateUrl: "views/login/findPassword.html",
            controller : findPasswordCtrl
        })

        .state('NextStepOpera', {
            url: "/NextStepOpera",
            params : { 'info' : null },
            templateUrl: "views/login/NextStepOpera.html",
            controller : nextStepOperaCtrl
        })

        .state('home', {
            url: "/home",
            templateUrl: "views/home/home.html",
            controller : homeCtrl
        })

        .state('article', {
            url: "/article",
            templateUrl: "views/article/article.html",
            controller : articleCtrl
        })

        .state('newArticle', {
            url: "/newArticle",
            templateUrl: "views/article/newArticle.html",
            controller : newArticleCtrl
        })

        .state('latestActivity', {
            url: "/latestActivity",
            templateUrl: "views/article/latestActivity.html",
            controller : latestActivityCtrl
        })

        .state('aboutUs', {
            url: "/aboutUs",
            templateUrl: "views/aboutUs/aboutUs.html",
            controller : aboutUsCtrl
        })

        .state('personalData', {
            url: "/personalData",
            templateUrl: "views/personalData/personalData.html",
            controller : personalDataCtrl
        })

        .state('searchList', {
            url: "/searchList",
            templateUrl: "views/searchList/searchList.html",
            controller : searchListCtrl
        })

        .state('Survey', {
            url: "/Survey",
            templateUrl: "views/Survey/Survey.html",
            controller : surveyCtrl
        })


}

angular
    .module('jibao')
    .config(config)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });
