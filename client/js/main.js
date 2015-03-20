/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone',
        'sample','chart/pieChart', 'chart/horizontalBarChart', 'chart/varticalBarChart', 'chart/lineChart'],
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
      me.chartArray = createChart(15);

      function createChart(chartCount) {

        var chartArray = new Array(chartCount);

        for (var i = 0; i < chartArray.length; i++) {
          index = i + 1;
          item = "chart" + i;
          $("#result").append(
              '<div id=\"' + item + '\" style=\"float:left\"></div>');
          chartArray[i] = createChartObject("#" + item, "サンプルチャート" + index, i % 5);
        }

        return chartArray;

      }

      function createChartObject(dom, caption, chartType) {

        var option = {
          dom: dom,
          title: {
            caption: caption
          },
          stroke : {
            width : 2, // 枠線の太さ
//            type  : Chart.STROKE_TYPE_DASH
            type  : Chart.STROKE_TYPE_DOT
          },
          width: 350,
          height: 300,
          sorted: false,
          // 横
          axisX : {
            max : maxRange,
            width : 14,
            caption : '値'
          },
          // 縦
          axisY : {
            max : maxRange,
            width : 50,
            title : '種類'
          },
          // bar
          bar : {
            weight : Chart.BAR_WEIGHT_THICK
          }
        };

//        if (chartType == 0) {
//          return new PieChart(option);
//        } else
        if (chartType == 0) {
          return new HolizontalBarChart(option);
        } else if (chartType == 1) {
          return new VerticalBarChart(option);
        } else if (chartType == 3) {
          return new LineChart(option);
        } else {
          return new LineChart(option);
        }
      }

      function drawChart(data, lineData, lineDataMulti) {
        // 処理,,,,,
        var list;
        for (var i = 0; i < me.chartArray.length; i++) {
          var tmpData = changeData(data);
          var tmpLData = changeDataForLine(lineData);
          var tmpLDataM = changeDataForLine(lineDataMulti);

          if (i % 5 == 0) {
            me.chartArray[i].draw(tmpData);
            if (i + 1 < me.chartArray.length) {
              me.chartArray[i + 1].draw(tmpData);
            }
            if (i + 2 < me.chartArray.length) {
              me.chartArray[i + 2].draw(tmpLData);
            }
            if (i + 3 < me.chartArray.length) {
              me.chartArray[i + 3].draw(tmpLData);
            }
            if (i + 4 < me.chartArray.length) {
              me.chartArray[i + 4].draw(tmpLDataM);
            }
          }
        }
      }

      function changeData(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = getRandomInt(0, maxRange);
//          data[i].value = 250;
        }
        return data;
      }

      function changeDataForLine(lineData) {
        for (var i = 0; i < lineData.value.length; i++) {
          for (var k = 0; k < lineData.value[i].length; k++) {
            lineData.value[i][k] = getRandomInt(0, maxRange);
//            lineData.value[i][k] = 250;
          }
        }
        return lineData;
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    });
