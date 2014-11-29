'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp',['SetController','angles']);

app.controller('MainController',  function($scope,$rootScope) {
    this.sets = [{  name:"Attacker", id:Math.random()} , { name:"Defender" , id:Math.random()}];
    $rootScope.dataStore=[];
    $scope.colors = [
        '#468966',
        '#FFF0A5',
        '#FFB03B',
        '#B64926',
        '#CCFF99',
        '#e1e1e1'
    ];
    $scope.selected = '#e1e1e1';

    $scope.chart = {};
    $scope.piechart = {};

    this.addSet = function(set){
        var toInsert = angular.copy(set);
        toInsert.id = Math.random();
        this.sets.push(toInsert);
    };

    this.removeSet = function(setToRemove){
        var indexToRemove = null;
        $.each(this.sets, function(index,set){
            if(set.id == setToRemove)
                indexToRemove = index;
        });
        if(indexToRemove!=null)
            this.sets.splice(indexToRemove,1);
    };

    $scope.calculateSet = function(set){
        var sumResult =0;
        var result = {};
        result.individuals = [];
        for(var diceKey in set.dices){
            var randomDice = Math.floor((Math.random() * set.dices[diceKey].faces) + 1);
            result.individuals.push(Math.floor((Math.random() * set.dices[diceKey].faces) + 1));
            sumResult += randomDice;
        }
        result.totalSum = sumResult;
        return result;
    };

    $scope.calculateWinners = function(data,numberRolls){
      var results = [];
        var dataResult =[];
      // Initialize the winners array
      for(var keySet in data)
         results[data[keySet].name] = {value:0, label:data[keySet].name,color: rgb2hex(data[keySet].color), highlight:rgb2hex(data[keySet].color)};
      results["Draws"]={value:0, label:"Draws",color: "#9E9E9E", highlight:"#E3E3E3"};


      for(var i=0;i<numberRolls;i++){

          var winner = Object.keys(data)[0]; // We set the first to initialize the winner
          for (var keySet in data){
              // We check for draws
              if( (data[winner].data[i].totalSum == data[keySet].data[i].totalSum)&& (data[keySet].name != data[winner].name)){
                  // It is a draw because same value and distinct name
                  winner = "Draws";
              }
              else{
                  winner = data[winner].data[i].totalSum < data[keySet].data[i].totalSum ? data[keySet].name : winner;
              }
          }
          // We update the wins of this roll
          results[winner].value++;
      }

        // Now we calculate the percentage of each
        for(var r in results){
            if(results[r].value!=0)
                results[r].value = results[r].value/numberRolls;
            dataResult.push(results[r]);
        }

        return dataResult;

    };

    $scope.calculateRolls = function(numberRolls){
        var result = [];

        // Looping the Sets
        for(var keySet in $rootScope.dataStore) {
            var temp = {};
            temp.data = [];
            var set = $rootScope.dataStore[keySet];
            temp.name = set.name;
            temp.color = set.color;
            for(var i=0;i<=numberRolls;i++)
                temp.data.push($scope.calculateSet(set));
            result[set.name]=temp;
        }

        $scope.chart = $scope.mountLineChart(result,numberRolls);
        $scope.piechart = $scope.calculateWinners(result,numberRolls);

    };

    $scope.mountLineChart = function(data,numberRolls){
        var lineChartData = { };
        lineChartData.datasets = [];
        lineChartData.labels = [];


        for(var i=0;i<numberRolls;i++){
            lineChartData.labels.push("Roll "+i);

        }

        for(var keySet in data){
            var set =data[keySet];

            var tempDS = {
                fillColor: set.color.replace(/[\d\.]+\)$/g, '0.3)'),
                strokeColor:  rgb2hex(set.color.replace(/[\d\.]+\)$/g, '0.3)')),
                pointColor:  set.color.replace(/[\d\.]+\)$/g, '0.8)'),
                pointStrokeColor:  rgb2hex(set.color.replace(/[\d\.]+\)$/g, '0.6)')),
                data : []
            };

            for(var dataSetKey in set.data){
                tempDS.data.push(set.data[dataSetKey].totalSum);
            }

            lineChartData.datasets.push(tempDS);
        }

        return lineChartData;

    };

    //$scope.chart={};
    $scope.chart= {
        labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets : [
            {
                fillColor : "rgba(151,187,205,0)",
                strokeColor : rgb2hex("rgba(151,187,205,0)"),
                pointColor : "rgba(151,187,205,0)",
                pointStrokeColor : rgb2hex("rgba(151,187,205,0)"),
                data : [4, 3, 5, 4, 6]
            },
            {
                fillColor : "rgba(151,187,205,0)",
                strokeColor : rgb2hex("rgba(151,187,205,0)"),
                pointColor : "rgba(151,187,205,0)",
                pointStrokeColor : rgb2hex("rgba(151,187,205,0)"),
                data : [8, 3, 2, 5, 4]
            }
        ]
    };

    $scope.piechart = [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }
    ]



});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});




var angles = angular.module("angles", []);

angles.chart = function (type) {
    return {
        restrict: "A",
        scope: {
            data: "=",
            options: "=",
            id: "@",
            width: "=",
            height: "=",
            resize: "=",
            chart: "@",
            segments: "@",
            responsive: "=",
            tooltip: "=",
            legend: "="
        },
        link: function ($scope, $elem) {
            var ctx = $elem[0].getContext("2d");
            var autosize = false;

            $scope.size = function () {
                if ($scope.width <= 0) {
                    $elem.width($elem.parent().width());
                    ctx.canvas.width = $elem.width();
                } else {
                    ctx.canvas.width = $scope.width || ctx.canvas.width;
                    autosize = true;
                }

                if($scope.height <= 0){
                    $elem.height($elem.parent().height());
                    ctx.canvas.height = ctx.canvas.width / 2;
                } else {
                    ctx.canvas.height = $scope.height || ctx.canvas.height;
                    autosize = true;
                }
            }

            $scope.$watch("data", function (newVal, oldVal) {
                if(chartCreated)
                    chartCreated.destroy();

                $scope.options = $scope.options || {};

                // if data not defined, exit
                if (!newVal) {
                    return;
                }
                if ($scope.chart) { type = $scope.chart; }

                if(autosize){
                    $scope.size();
                    chart = new Chart(ctx);
                };

                if($scope.responsive || $scope.resize)
                    $scope.options.responsive = true;

                if($scope.responsive !== undefined)
                    $scope.options.responsive = $scope.responsive;

                chartCreated = chart[type]($scope.data, $scope.options);
                chartCreated.update();
                if($scope.legend)
                    angular.element($elem[0]).parent().after( chartCreated.generateLegend() );
            }, true);

            $scope.$watch("tooltip", function (newVal, oldVal) {
                if (chartCreated)
                    chartCreated.draw();
                if(newVal===undefined || !chartCreated.segments)
                    return;
                if(!isFinite(newVal) || newVal >= chartCreated.segments.length || newVal < 0)
                    return;
                var activeSegment = chartCreated.segments[newVal];
                activeSegment.save();
                activeSegment.fillColor = activeSegment.highlightColor;
                chartCreated.showTooltip([activeSegment]);
                activeSegment.restore();
            }, true);

            $scope.size();
            var chart = new Chart(ctx);
            var chartCreated;
        }
    }
}


/* Aliases for various chart types */
angles.directive("chart", function () { return angles.chart(); });
angles.directive("linechart", function () { return angles.chart("Line"); });
angles.directive("barchart", function () { return angles.chart("Bar"); });
angles.directive("radarchart", function () { return angles.chart("Radar"); });
angles.directive("polarchart", function () { return angles.chart("PolarArea"); });
angles.directive("piechart", function () { return angles.chart("Pie"); });
angles.directive("doughnutchart", function () { return angles.chart("Doughnut"); });
angles.directive("donutchart", function () { return angles.chart("Doughnut"); });


//Function to convert hex format to a rgb color
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}