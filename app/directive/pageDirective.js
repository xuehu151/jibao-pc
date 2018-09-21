/**
 * Created by Administrator on 2018/8/13.
 */
angular.module("jibao")
    .directive('whenScrolled', function () {
        return function ( scope, elm, attr ) {
            // 内层DIV的滚动加载
            var raw = elm[ 0 ];
            elm.bind ('scroll', function () {
                if ( raw.scrollTop + raw.offsetHeight >= raw.scrollHeight ) {
                    scope.$apply (attr.whenScrolled);
                }
            });
        };


    });
