/**
 * VerticalBarChart
 */
define(['chart/chart'], function () {
  this.VerticalBarChart = function VerticalBarChart(option) {

    // Chart共通オプションはChart.js参照
    var DEF_OPT = {
      // 横軸
      axisX: {
        height: 20
      },
      // 横軸
      axisY: {
        max: 500,
        width: 50
      },
      // BARの太さ
      barWeight: VerticalBarChart.WEIGHT_NORMAL,
      // 右側余裕
      rightMargin: 20
    };

    Chart.call(this, option);
    $.extend(true, this.opt, DEF_OPT, option);
  };

  //BARの太さ
  VerticalBarChart.WEIGHT_THIN = 0.6;
  VerticalBarChart.WEIGHT_NORMAL = 0.8;
  VerticalBarChart.WEIGHT_THICK = 1;

  /* draw時、データ定義サンプル
   *  Sample.DATA = [{caption: "項目1",value: "50",color: "#98abc5"},{データの個数分配列}]
   */
  VerticalBarChart.prototype = Object.create(Chart.prototype, {
    constructor: {
      value: VerticalBarChart,
      enumerable: false,
      writable: true,
      configurable: true
    },
    // グラフ作成
    _create: {
      value: function (data) {

        $(".thick line").css("opacity", "0.2");

        var me = this;

        // 領域のリセット
        $(me.opt.dom).empty();

        // 基底オブジェクト生成
        var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", me.opt.height);

        // グラフ出力サイズ（タイトル・縦ラベル幅を除外）
        var left = me.opt.axisY.width;
        var width = me.opt.width - me.opt.axisY.width - me.opt.rightMargin;
        var top = me._drawTitle(svg, me.opt, (width / 2) + left);
        var height = this._getHeight(me.opt, top);

        // 縦軸作成
        me._createAxisY(svg, me.opt, top, left, height, width);

        // 横軸作成
        me._createAxisX(svg, me.opt, top, left, height, width, data);

        me.barScale = height / me.opt.axisY.max;   // 比率
        var barAreaSize = width / data.length;
        var barSize = barAreaSize * (0.8 * me.opt.barWeight);  // 棒グラフの縦幅

        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .enter()
            .append("rect") // SVGでの四角形を示す要素を生成
            .attr("stroke", function (d, i) {
              return d.color;
            })
            .attr("x", function (d, i) {
              return left + (i * barAreaSize) + ((barAreaSize - barSize) / 2);
            })
            .attr("y", function (d) {
              var value = ((height + top) - (d.value * me.barScale));
              return ((value >= 0) ? value : 0) + "px";
            })
            .attr("width", barSize)
            .attr("height", function (d) {
              var value = (d.value * me.barScale) - 1;
              return ((value >= 0) ? value : 0) + "px";
            })
            .attr("transform", "translate(0, 0)")
            .style("fill", function (d, i) {
              return d.color;
            });

        me.svg = svg;
        me.top = top;
        me.height = height;
      }
    },
    _redraw: {
      value: function (data) {

        var me = this;
        var svg = me.svg;
        var top = me.top;
        var height = me.height;

        // データを更新する処理
        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .transition()
            .duration(800) // 動作時間ß
            .attr("y", function (d) {
              var value = ((height + top) - (d.value * me.barScale));
              return ((value >= 0) ? value : 0) + "px";
            })
            .attr("height", function (d) {
              var value = d.value * me.barScale;
              return ((value >= 0) ? value : 0) + "px";
            })

      }
    },
    // 高さ取得
    _getHeight: {
      value: function (opt, top) {
        return opt.height - top - opt.axisX.height; // x軸フォント高さ
      }
    },
    // 縦軸
    _createAxisY: {
      value: function _createAxisY(svg, opt, top, left, height, width) {

        var yScale = d3.scale.linear() // スケールを設定
            .domain([0, opt.axisY.max]) // 元のサイズ
            .range([height, 0]);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + left + "," + top + ")")
            .call(d3.svg.axis()
                .scale(yScale) // スケールを適用する
                .orient("left").tickPadding(5)
                .tickSize(-width, 0)// 目盛線の長さ（内側,外側）
        );

      }
    },
    // 縦軸
    _createAxisX: {
      value: function (svg, opt, top, left, height, width, data) {

        // 目盛りを表示するためにスケールを設定
        var xScale = d3.scale.linear() // スケールを設定
            .domain([0, data.length * 2]) // 元のサイズ
            .range([0, width]);

        var cnt = 0;

        // 目盛りを設定し表示する
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + left + ", " + (height + top) + ")")
            .call(d3.svg.axis().scale(xScale) // スケールを適用する
                .tickValues(function () {
                  return _.range(0, data.length * 2);
                })
                .tickFormat(function (d, i) {
                  return (i % 2 > 0) ? data[cnt++].caption : "";
                })
                .orient("bottom") // 目盛りの表示位置を下側に指定
                .tickPadding(7)
                .tickSize(0, 0)// 目盛線の長さ（内側,外側）
        );

        svg.append("line")
            .attr("x1", left + width)
            .attr("y1", top)
            .attr("x2", left + width)
            .attr("y2", height + top)
            .attr("stroke-width", 0.2)
            .attr("stroke", "black");

      }
    }
  });

  return VerticalBarChart;

});
