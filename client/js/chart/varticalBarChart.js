/**
 * VerticalBarChart
 */
define(['chart/chart'], function () {
  this.VerticalBarChart = function VerticalBarChart(option) {
    Chart.call(this, option);
  };

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
        var top = me._drawTitle(svg, me.opt, ((me.opt.width - me.opt.axisY.width) / 2) + me.opt.axisY.width);
        var width = me.opt.width - (me.opt.axisY.width + 40);
        var height = this._getHeight(me.opt);
        var left = (7 + me.opt.axisY.width);

        // 縦軸作成
        me._createAxisY(svg, me.opt, top, left, height, width);

        // 横軸作成
        me._createAxisX(svg, me.opt, top, left, height, width, data);

        me.barScale = (height - top) / me.opt.axisY.max;   // 比率
        var barAreaSize = width / data.length;
        var barSize = barAreaSize * (0.8 * me.opt.bar.weight);  // 棒グラフの縦幅

        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .enter()
            .append("rect") // SVGでの四角形を示す要素を生成
            .attr("stroke", function (d, i) {
              return d.color;
            }) // 円グラフの区切り線を白色にする
            .attr("x", function (d, i) {
              return left + (i * barAreaSize) + ((barAreaSize - barSize) / 2);
            })
            .attr("y", function (d) {
              var value = (height - (d.value * me.barScale));
              return ((value >= 0) ? value : 0) + "px";
            })
            .attr("width", barSize)   // 棒グラフの高さを指定
            .attr("height", function (d) {
              var value = ((d.value * me.barScale) - 1);
              return ((value >= 0) ? value : 0) + "px";
            })
            .attr("transform", "translate(0, 0)")
            .style("fill", function (d, i) {
              return d.color;
            });

        me.svg = svg;
      }
    },
    _redraw: {
      value: function (data) {

        var me = this;
        var svg = me.svg;
        var height = this._getHeight(me.opt);

        // データを更新する処理
        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .transition()
            .duration(800) // 動作時間ß
            .attr("y", function (d) {
              var value = (height - (d.value * me.barScale));
              return ((value >= 0) ? value : 0) + "px";
            })
            .attr("height", function (d) {
              var value = ((d.value * me.barScale) - 1);
              return ((value >= 0) ? value : 0) + "px";
            })

      }
    },
    // 縦軸
    _createAxisY: {
      value: function _createAxisY(svg, opt, top, left, height, width) {

        var yScale = d3.scale.linear() // スケールを設定
            .domain([0, opt.axisY.max]) // 元のサイズ
            .range([height, top]);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + left + ", 0)")
            .call(d3.svg.axis()
                .scale(yScale) // スケールを適用する
                .orient("left").tickPadding(5)
                .tickSize(-width, 0)// 目盛線の長さ（内側,外側）
        );

        svg.append("line")
            .attr("x1", left + width)
            .attr("y1", top)
            .attr("x2", left + width)
            .attr("y2", height)
            .attr("stroke-width", 0.2)
            .attr("stroke", "black");

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
            .attr("transform", "translate(" + left + ", " + height + ")")
            .call(d3.svg.axis().scale(xScale) // スケールを適用する
                .tickValues(function () {
                  return _.range(0, data.length * 2);
                })
                .tickFormat(function (d, i) {
                  return (i % 2 > 0) ? data[cnt++].caption : "";
                })
                .orient("bottom") // 目盛りの表示位置を下側に指定
                .tickPadding(5)
                .tickSize(0, 0)// 目盛線の長さ（内側,外側）
        );

      }
    }
  });

  return VerticalBarChart;

});
