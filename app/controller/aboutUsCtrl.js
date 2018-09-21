/**
 * Created by Administrator on 2018/7/14.
 */

function aboutUsCtrl( $scope, $state, $rootScope ) {
    var global = sessionStorage.getItem('global');
    if(global){
        $rootScope.headerShowHide = true;
    }else {
        $rootScope.headerShowHide = false;
    }
    $rootScope.latestActivBtnArr = JSON.parse(sessionStorage.getItem('latestActivBtn'));
    var aboutUs = $scope.aboutUs = {
        LatestActivity : function (  ) {
            var content = JSON.parse(sessionStorage.getItem('content'));
            $state.go('latestActivity');
        }
    }



}


angular
    .module('jibao')
    .controller('aboutUsCtrl', aboutUsCtrl);

