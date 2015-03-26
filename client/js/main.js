/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone',
        'sample','chart/pieChart', 'chart/horizontalBarChart',
        'chart/varticalBarChart', 'chart/lineChart', 'chart/radarChart'
        ,'chart/normalTree','chart/roundTree','chart/treeMap'
        ,'chart/activePartition'],
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
        } else if (activated_tab.hash == "#menu4") {
          createExtraTree();
        }
      });

      // data-change btnClick(loop)
      $("#dataChange").on("click", function () {
        var cnt = 0;
        drawChart();

        var timer = setInterval(function () {
          drawChart();
          cnt += 1;
          if (cnt > 100) {
            clearInterval(timer);
          }
        }, 3000);
      });

      // サンプルChart
      me.chartArray = createChart(6);
      drawChart();

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

      function drawChart() {

        for (var i = 0; i < me.chartArray.length; i++) {

          if (i % 6 == 0) {
            me.chartArray[i].draw(changeData(Sample.BAR_DATA,40));
            if (i + 1 < me.chartArray.length) {
              me.chartArray[i + 1].draw(changeData(Sample.BAR_DATA,40));
            }
            if (i + 2 < me.chartArray.length) {
              me.chartArray[i + 2].draw(changeData(Sample.PIE_DATA,40));
            }
            if (i + 3 < me.chartArray.length) {
              me.chartArray[i + 3].draw(changeDataForLine(Sample.LINE_DATA));
            }
            if (i + 4 < me.chartArray.length) {
              me.chartArray[i + 4].draw(changeDataForLine(Sample.LINE_DATA_MULTI));
            }
            if (i + 5 < me.chartArray.length) {
              me.chartArray[i + 5].draw(changeDataForRadar(Sample.RADAR_DATA));
            }
          }
        }
      }

      function changeData(data,range) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = getRandomInt(0, range);
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

        // 基本ツリー
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

        // 円形ツリー
        var dom = "roundTree";
        $("#target2").append('<div id=\"' + dom + '\" style=\"float:left\"></div>');

        var option = {
            dom: '#' + dom,
            title: {
              caption: '円形ツリー'
            },
            width: 800,
            height: 800
          };

        var roundTree = new RoundTree(option);
        roundTree.draw(Sample.TREE_DATA);

      }

      function createExtraTree(){

        // ツリーマップ
        var dom = "treeMap";
        $("#target3").append('<div id=\"' + dom + '\" style=\"float:left\"></div>');

        var option = {
            dom: '#' + dom,
            title: {
              caption: 'ツリーマップ'
            },
            width: 800,
            height: 800
          };

        var treeMap = new TreeMap(option);
        treeMap.draw(Sample.MAP_DATA);

        // パーテーション
        var dom = "activePartition";
        $("#target3").append('<div id=\"' + dom + '\" style=\"float:left\"></div>');

        var option = {
            dom: '#' + dom,
            title: {
              caption: 'パーテーション（クリックで拡大）'
            },
            width: 800,
            height: 800
          };

        var activePartition = new ActivePartition(option);
        activePartition.draw(Sample.MAP_DATA);
        //activePartition.draw(Sample.TEST);
      }
    });
