/**
 * Created by yoji on 15/03/09.
 */
<<<<<<< HEAD
define([ 'bootstrap', 'underscore', 'backbone', 'chart/chart' ], function(
    bootstrap, _, backbone) {
=======
define(['bootstrap', 'underscore', 'backbone', 'd3', 'chart'],
    function (bootstrap, _, backbone, d3) {
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

<<<<<<< HEAD
  // pieChart,barChartサンプルデータ
  var data = [ {
    caption : "項目1",
    value : "",
    color : "#98abc5"
  }, {
    caption : "項目2",
    value : "",
    color : "##8a89a6"
  }, {
    caption : "項目3",
    value : "",
    color : "#7b6888"
  }, {
    caption : "項目4",
    value : "",
    color : "#6b486b"
  }, {
    caption : "項目5",
    value : "",
    color : "#a05d56"
  } ];
=======
      var list = [["項目1", "10", "#98abc5"], ["項目2", "30", "#8a89a6"],
        ["項目3", "20", "#7b6888"], ["項目4", "60", "#6b486b"],
        ["項目5", "15", "#a05d56"]];
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

<<<<<<< HEAD
  // lineChartサンプルデータ(データ-１系統）
  var lineData = {
    caption : [ "", "1/25", "2/25", "3/25", "4/25" ],
    color : [ "#98abc5" ],
    data : [ [ 10, 30, 40, 20, 30 ] ]
  }

  // lineChartサンプルデータ(データ-3系統）
  var lineDataMulti = {
    caption : [ "", "1/25", "2/25", "3/25", "4/25" ],
    color : [ "#98abc5", "#a05d56", "#8a89a6" ],
    data : [ [ 10, 30, 40, 20, 30 ], [ 100, 20, 30, 50, 60 ],
        [ 100, 20, 30, 50, 60 ] ]
  }

  var me = this;

  // event define

  // tab-change
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    var activated_tab = e.target; // activated tab
    var previous_tab = e.relatedTarget; // previous tab
    if (activated_tab.hash == "#menu2") {
      drawChart(data, lineData,lineDataMulti);
    }
  });

  // data-change btnClick
  $("#dataChange").on("click", function() {
    var cnt = 0;
    drawChart(data, lineData,lineDataMulti);

    var timer = setInterval(function() {
      drawChart(list, list_Line);
      cnt += 1;
      if (cnt > 100) {
        clearInterval(timer);
=======
      var list_Line = {
        caption: ["", "1/25", "2/25", "3/25", "4/25"]
        , color: ["#98abc5", "#a05d56", "#8a89a6"]
        , data: [
          [10, 30, 40, 20, 30]
          , [100, 20, 30, 50, 60]
          , [100, 20, 30, 50, 60]
        ]
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git
      }
    }, 3000);
  });

  // サンプルChart
  me.chartArray = createChart(12);

  function createChart(chartCount) {

<<<<<<< HEAD
    var chartArray = new Array(chartCount);
=======
      // tab-change
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var activated_tab = e.target; // activated tab
        var previous_tab = e.relatedTarget; // previous tab
        if (activated_tab.hash == "#menu2") {
          drawChart(list, list_Line);
        }
      });
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

<<<<<<< HEAD
    for (var i = 0; i < chartArray.length; i++) {
      index = i + 1;
      item = "chart" + i;
      $("#result").append(
          '<div id=\"' + item + '\" style=\"float:left\"></div>');
      chartArray[i] = createChartObject("#" + item, "サンプルチャート" + index, i % 4);
    }
=======
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
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

    return chartArray;

<<<<<<< HEAD
  }
=======
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
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

<<<<<<< HEAD
  function createChartObject(dom, caption, chartType) {
=======
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
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

<<<<<<< HEAD
    var option = {
        dom : dom,
        title : {
          caption : caption
        },
        width : 200,
        height : 200,
        sorted : false,
        axisStyle : {
            width : 32,
            maxValue : 200
=======
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

>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git
        }
      }

<<<<<<< HEAD
    if (chartType == 0) {
      return new PieChart(option);
    } else if (chartType == 0) {
      return new HolizontalBarChart(option);
    } else if (chartType == 2) {
      return new LineChart(option);
    } else {
      return new LineChart(option);
    }
  }

  function drawChart(data, lineData,lineDataMulti) {
    // 処理,,,,,
    var list;
    for (var i = 0; i < me.chartArray.length; i++) {
      if (i % 4 == 0) {
        me.chartArray[i].draw(changeData(data));
        if (i + 1 < me.chartArray.length) {
          me.chartArray[i + 1].draw(changeData(data));
        }
        if (i + 2 < me.chartArray.length) {
          me.chartArray[i + 2].draw(changeDataForLine(lineData));
        }
        if (i + 3 < me.chartArray.length) {
          me.chartArray[i + 3].draw(changeDataForLine(lineDataMulti));
=======
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
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git
        }
      }
    }
  }

<<<<<<< HEAD
  function changeData(data) {
    for (var i = 0; i < data.length; i++) {
      list[i].value = getRandomInt(0, 200);
    }
    return list;
  }

  function changeDataForLine(lineData) {
    for (var i = 0; i < lineData.data.length; i++) {
      for (var k = 0; k < lineData.data[i].length; k++) {
        lineData.data[i][k] = getRandomInt(0, 200);
=======
      function changeItemName(list, tp) {
        for (var i = 0; i < list.length; i++) {
          list[i][0] = getItemName(i, tp);
        }
        return list;
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git
      }
    }
    return lineData;
  }

<<<<<<< HEAD
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
=======
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
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git

<<<<<<< HEAD
});
=======
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
>>>>>>> branch 'master' of https://github.com/yojio/d3-sample.git
