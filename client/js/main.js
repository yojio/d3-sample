/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone',
        'chart/pieChart', 'chart/horizontalBarChart', 'chart/varticalBarChart', 'chart/lineChart',
      'sample'],
    function (bootstrap, _, backbone) {

      var maxRange = 1000;
      var me = this;

      // event define

      // tab-change
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var activated_tab = e.target; // activated tab
        var previous_tab = e.relatedTarget; // previous tab
        if (activated_tab.hash == "#menu2") {
          drawChart(Sample.DATA, Sample.LINE_DATA, Sample.LINE_DATA_MULTI);
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
      me.chartArray = createChart(12);

      function createChart(chartCount) {

        var chartArray = new Array(chartCount);

        for (var i = 0; i < chartArray.length; i++) {
          index = i + 1;
          item = "chart" + i;
          $("#result").append(
              '<div id=\"' + item + '\" style=\"float:left\"></div>');
          chartArray[i] = createChartObject("#" + item, "サンプルチャート" + index, i % 4);
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
          height: 300,
          sorted: false,
          axis: {
            xwidth: 32,
            ywidth: 50,
            maxValue: 200
          }
        }

        return new LineChart(option);
//        if (chartType == 0) {
//          return new PieChart(option);
//        } else if (chartType == 0) {
//          return new HolizontalBarChart(option);
//        } else if (chartType == 2) {
//          return new LineChart(option);
//        } else {
//          return new LineChart(option);
//        }
      }

      function drawChart(data, lineData, lineDataMulti) {
        // 処理,,,,,
        var list;
        for (var i = 0; i < me.chartArray.length; i++) {
        me.chartArray[i].draw(changeDataForLine(lineDataMulti));
//          if (i % 4 == 0) {
//            me.chartArray[i].draw(changeData(data));
//            if (i + 1 < me.chartArray.length) {
//              me.chartArray[i + 1].draw(changeData(data));
//            }
//            if (i + 2 < me.chartArray.length) {
//              me.chartArray[i + 2].draw(changeDataForLine(lineData));
//            }
//            if (i + 3 < me.chartArray.length) {
//              me.chartArray[i + 3].draw(changeDataForLine(lineDataMulti));
//            }
//          }
        }
      }

      function changeData(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = getRandomInt(0, maxRange);
        }
        return data;
      }

      function changeDataForLine(lineData) {
        for (var i = 0; i < lineData.data.length; i++) {
          for (var k = 0; k < lineData.data[i].length; k++) {
            lineData.data[i][k] = getRandomInt(0, maxRange);
          }
        }
        return lineData;
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    });
