/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone',
        'sample','chart/pieChart', 'chart/horizontalBarChart',
        'chart/varticalBarChart', 'chart/lineChart', 'chart/radarChart'],
    function (bootstrap, _, backbone) {

      var maxRange = 500;

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
      this.chartArray = createChart(6);

      function createChart(chartCount) {

        var chartArray = new Array(chartCount);

        for (var i = 0; i < chartArray.length; i++) {
          index = i + 1;
          item = "chart" + i;
          $("#result").append(
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
          height: 300,
        };

        if (chartType == 0) {
          return new HolizontalBarChart(option);
        } else if (chartType == 1) {
          return new VerticalBarChart(option);
        } else if (chartType == 2) {
          return new PieChart(option);
        } else if (chartType == 3) {
          return new LineChart(option);
        } else if (chartType == 4) {
          return new LineChart(option);
        } else {
          return new RadarChart(option);
        }
      }

      function drawChart(data, lineData, lineDataMulti) {

        for (var i = 0; i < this.chartArray.length; i++) {

          var tmpData = changeData(data);
          var tmpLData = changeDataForLine(lineData);
          var tmpLDataM = changeDataForLine(lineDataMulti);
          var tmpRData = changeDataForRadar(Sample.RADAR_DATA);

          if (i % 6 == 0) {
            this.chartArray[i].draw(tmpData);
            if (i + 1 < this.chartArray.length) {
              this.chartArray[i + 1].draw(tmpData);
            }
            if (i + 2 < this.chartArray.length) {
              this.chartArray[i + 2].draw(tmpData);
            }
            if (i + 3 < this.chartArray.length) {
              this.chartArray[i + 3].draw(tmpLData);
            }
            if (i + 4 < this.chartArray.length) {
              this.chartArray[i + 4].draw(tmpLDataM);
            }
            if (i + 5 < this.chartArray.length) {
              this.chartArray[i + 5].draw(tmpRData);
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
    });
