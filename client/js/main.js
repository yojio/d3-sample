/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone', 'd3', 'chart'],
    function (bootstrap, _, backbone, d3) {

      var list = [["項目1", "10", "#98abc5"], ["項目2", "30", "#8a89a6"],
        ["項目3", "20", "#7b6888"], ["項目4", "60", "#6b486b"],
        ["項目5", "15", "#a05d56"]];

      var list_Line = {
        caption: ["", "1/25", "2/25", "3/25", "4/25"]
        , color: ["#98abc5", "#a05d56", "#8a89a6"]
        , data: [
          [10, 30, 40, 20, 30]
          , [100, 20, 30, 50, 60]
          , [100, 20, 30, 50, 60]
        ]
      }

      var me = this;
      me.chartArray = new Array(12);
      for (var i = 0; i < me.chartArray.length; i++) {
        index = i + 1;
        item = "chart" + i;
        $("#result").append(
            '<div id=\"' + item + '\" style=\"float:left\"></div>');

        me.chartArray[i] = createChartObject("#" + item, "サンプルチャート" + index,
            i % 4);
      }

      // tab-change
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var activated_tab = e.target; // activated tab
        var previous_tab = e.relatedTarget; // previous tab
        if (activated_tab.hash == "#menu2") {
          drawChart(list, list_Line);
        }
      });

      $("#dataChange").on("click", function () {
        var cnt = 0;
        var timer = setInterval(function () {
          drawChart(list, list_Line);
          cnt += 1;
          if (cnt > 100) {
            clearInterval(timer);
          }
        }, 1000);
      });

      function createChartObject(dom, caption, chartType) {

        if (chartType == 1) {
          return new PieChart({
            dom: dom,
            title: {
              caption: caption
            },
            width: 200,
            height: 200,
            sorted: false
          });
        } else if (chartType == 0) {
          return new HorizontalBarChart({
            dom: dom,
            title: {
              caption: caption
            },
            width: 300,
            height: 300,
            sorted: false,
            axisStyle: {
              width: 32,
              maxValue: 200
            }
          });

        } else if (chartType == 2) {
          return new LineChart({
            dom: dom,
            title: {
              caption: caption
            },
            width: 300,
            height: 300,
            sorted: false,
            axisStyle: {
              width: 32,
              maxValue: 200
            }
          });
        } else {

          return new ArrayLineChart({
            dom: dom,
            title: {
              caption: caption
            },
            width: 300,
            height: 300,
            sorted: false,
            axisStyle: {
              width: 32,
              maxValue: 200
            }
          });

        }
      }

      function drawChart(data, dataArr) {
        // 処理,,,,,
        var list;
        for (var i = 0; i < me.chartArray.length; i++) {
          if (i % 4 == 0) {
            list = changeData(data);
            me.chartArray[i].draw(changeItemName(list, 0));
            if (i + 1 < me.chartArray.length) {
              me.chartArray[i + 1].draw(changeItemName(list, 0));
            }
            if (i + 2 < me.chartArray.length) {
              me.chartArray[i + 2].draw(changeItemName(list, 1));
            }
            if (i + 3 < me.chartArray.length) {
              me.chartArray[i + 3].draw(changeData2(dataArr));
            }
          }
        }
      }

      function changeItemName(list, tp) {
        for (var i = 0; i < list.length; i++) {
          list[i][0] = getItemName(i, tp);
        }
        return list;
      }

      function getItemName(index, tp) {
        if (tp == 0) {
          return "項目" + (index + 1);
        } else {
          if (i == 0) {
            return "";
          } else {
            return index + "/25";
          }
        }
      }

      function changeData(list) {
        for (var i = 0; i < list.length; i++) {
          list[i][1] = getRandomInt(0, 200);
        }
        return list;
      }

      function changeData2(list) {
        for (var i = 0; i < list.data.length; i++) {
          for (var k = 0; k < list.data[i].length; k++) {
            list.data[i][k] = getRandomInt(0, 200);
          }
        }
        return list;
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    });
