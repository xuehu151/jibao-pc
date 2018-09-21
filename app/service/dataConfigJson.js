/**
 * Created by Administrator on 2018/8/8.
 */

angular.module('jibao')
    .factory('$configService',function (  ) {
        return {
            jsonData : [
                {
                    title : '多年不曾问候，是否幸福或自由',
                    content : '遥远的十八世纪 苏格兰诗人罗伯特彭斯 根据当地父老的吟唱 记录下了一首名为Auld Lang Syne的诗歌'
                },
                {
                    title : '把酒言欢竟然还有这么多讲究',
                    content : '我国是酒的故乡，是世界上最早酿酒的国家之一。古有曹操对酒当歌，人生几何？；李白花间一壶酒，独酌无相亲；'

                },
                {
                    title : '10年间，这位国外摄影师拍遍了国内地标性建筑',
                    content : '当我们生活乏味时或许最普遍的一种“自救”方法就是出去旅游，那些陌生的人们陌生的建筑总是能带给我们新鲜感和一种身心舒畅的感受。'

                }
            ]
        }
    });
