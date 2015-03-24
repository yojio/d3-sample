/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone',
        'sample','chart/pieChart', 'chart/horizontalBarChart',
        'chart/varticalBarChart', 'chart/lineChart', 'chart/radarChart'
        ,'chart/normalTree'],
    function (bootstrap, _, backbone) {

      var maxRange = 500;
      var me = this;

      // event define

      // tab-change
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var activated_tab = e.target; // activated tab
        var previous_tab = e.relatedTarget; // previous tab
        if (activated_tab.hash == "#menu2") {
          drawChart(Sample.DATA, Sample.LINE_DATA, Sample.LINE_DATA_MULTI);
        } else if (activated_tab.hash == "#menu3") {
          createBasicTree();
        }
      });

      // data-change btnClick(loop)
      $("#dataChange").on("click", function () {
        var cnt = 0;
        drawChart(Sample.DATA, Sample.LINE_DATA, Sample.LINE_DATA_MULTI);

        var timer = setInterval(function () {
          drawChart(Sample.DATA, Sample.LINE_DATA, Sample.LINE_DATA_MULTI);
          cnt += 1;
          if (cnt > 100) {
            clearInterval(timer);
          }
        }, 3000);
      });

      // サンプルChart
      me.chartArray = createChart(6);
      drawChart(Sample.DATA, Sample.LINE_DATA, Sample.LINE_DATA_MULTI);

      function createChart(chartCount) {

        var chartArray = new Array(chartCount);

        for (var i = 0; i < chartArray.length; i++) {
          index = i + 1;
          item = "chart" + i;
          $("#target1").append(
              '<div id=\"' + item + '\" style=\"float:left\"></div>');
          chartArray[i] = createChartObject("#" + item, "サンプルチャート" + index, i % 6);
        }

        return chartArray;

      }

      function createChartObject(dom, caption, chartType) {

        var option = {
          dom: dom,
          title: {
            caption: caption
          },
          width: 350,
          height: 300
        };

        if (chartType == 0) {
          option.title.caption = "合格最低点人数分布(人)";
          option.axisX = {
            max:40
          };
          return new HolizontalBarChart(option);
        } else if (chartType == 1) {
          option.title.caption = "合格最低点人数分布(人)";
          option.axisY = {
            max:40
          };
          return new VerticalBarChart(option);
        } else if (chartType == 2) {
          option.title.caption = "東大理系ー配点(%)";
          return new PieChart(option);
        } else if (chartType == 3) {
          option.title.caption = "五教科合計点推移";
          return new LineChart(option);
        } else if (chartType == 4) {
          option.title.caption = "五教科合計点推移";
          return new LineChart(option);
        } else {
          option.title.caption = "分類別評価(5段階)";
          option.max = 5;
          option.category = ["英語","数学","理科","国語","社会"];
          return new RadarChart(option);
        }
      }

      function drawChart(data, lineData, lineDataMulti) {

        for (var i = 0; i < me.chartArray.length; i++) {

//          var tmpData = changeData(data);
          var tmpLData = changeDataForLine(lineData);
          var tmpLDataM = changeDataForLine(lineDataMulti);
          var tmpRData = changeDataForRadar(Sample.RADAR_DATA);

          if (i % 6 == 0) {
            me.chartArray[i].draw(Sample.BAR_DATA);
            if (i + 1 < me.chartArray.length) {
              me.chartArray[i + 1].draw(Sample.BAR_DATA);
            }
            if (i + 2 < me.chartArray.length) {
              me.chartArray[i + 2].draw(Sample.PIE_DATA);
            }
            if (i + 3 < me.chartArray.length) {
              me.chartArray[i + 3].draw(tmpLData);
            }
            if (i + 4 < me.chartArray.length) {
              me.chartArray[i + 4].draw(tmpLDataM);
            }
            if (i + 5 < me.chartArray.length) {
              me.chartArray[i + 5].draw(tmpRData);
            }
          }
        }
      }

      function changeData(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = getRandomInt(0, maxRange);
        }
        return data;
      }

      function changeDataForLine(lineData) {
        for (var i = 0; i < lineData.value.length; i++) {
          for (var k = 0; k < lineData.value[i].length; k++) {
            lineData.value[i][k] = getRandomInt(0, maxRange);
          }
        }
        return lineData;
      }

      function changeDataForRadar(radarData) {
        for (var i = 0; i < radarData.length; i++) {
          for (var k = 0; k < radarData[i].value.length; k++) {
            radarData[i].value[k] = getRandomInt(1, 5);
          }
        }
        return radarData;
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function createBasicTree(){

        var dom = "normalTree";
        $("#target2").append('<div id=\"' + dom + '\" style=\"float:left\"></div>');

        var option = {
            dom: '#' + dom,
            title: {
              caption: '基本ツリー'
            },
            width: 800,
            height: 800
          };

        var normalTree = new NormalTree(option);
        normalTree.draw(Sample.TREE_DATA);

      }
    });
