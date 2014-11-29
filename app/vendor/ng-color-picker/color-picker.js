angular.module('ngColorPicker', [])
.directive('ngColorPicker', function() {
    var defaultColors =  [
        'rgba(215, 44, 46, 1)',
        'rgba(123, 209, 72, 1)',
        'rgba(84, 132, 237, 1)',
        'rgba(164, 189, 252,1)',
        'rgba(164, 189, 252, 1)',
        'rgba(251, 215, 91, 1)',
        'rgba(255, 136, 124, 1)',
    ];
    return {
        scope: {
            selected: '=',
            customizedColors: '=colors'
        },
        restrict: 'AE',
        template: '<ul><li ng-repeat="color in colors" ng-class="{selected: (color===selected)}" ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
        link: function (scope, element, attr) {
            scope.colors = scope.customizedColors || defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function (color) {
                scope.selected = color;
            };

        }
    };

});