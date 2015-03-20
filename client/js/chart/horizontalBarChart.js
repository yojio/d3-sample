/**
 * HolizontalBarChart
 */
define(['chart/chart'], function () {
  this.HolizontalBarChart = function HolizontalBarChart(option) {
    Chart.call(this, option);
  };

  HolizontalBarChart.prototype = Object.create(Chart.prototype, {
    constructor: {
      value: HolizontalBarChart,
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

        // 横軸作成
        me._createAxisX(svg, me.opt, top, left, height, width);

        // 縦軸作成
        me._createAxisY(svg, me.opt, top, left, height, width, data);

        me.barScale = width / me.opt.axisX.max;   // 比率
        var barAreaSize = (height - top) / data.length;
        var barSize = barAreaSize * (0.8 * me.opt.bar.weight);  // 棒グラフの縦幅

        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .enter()
            .append("rect") // SVGでの四角形を示す要素を生成
            .attr("stroke", function (d, i) {
              return d.color;
            }) // 円グラフの区切り線を白色にする
            .attr("x", me.opt.axisY.width)   // 横棒グラフなのでX座標は0。これはSVG上での座標
            .attr("y", function (d, i) {   // Y座標を配列の順序に応じて計算
              return top + ((data.length - (i + 1)) * barAreaSize) + ((barAreaSize - barSize) / 2);
            })
            .attr("width", function (d) { // 横幅を配列の内容に応じて計算
              return ((d.value * me.barScale) - 1) + "px";
            })
            .attr("height", barSize)   // 棒グラフの高さを指定
            .attr("transform", "translate(8, 0)")
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

        // データを更新する処理
        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .transition()
            .attr("width", function (d) { // 横幅を配列の内容に応じて計算
              return (d.value * me.barScale) + "px";
            })

      }
    },
    // 高さ取得
    _getHeight: {
      value: function _getHeight(opt) {
        return opt.height - 20; // x軸フォント高さ
      }
    },
    // 縦軸
    _createAxisY: {
      value: function (svg, opt, top, left, height, width, data) {

        var yScale = d3.scale.linear()  // スケールを設定
            .domain([0, data.length * 2])   // 元のサイズ
            .range([height, top]);

        var cnt = 0;

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + left + ", 0)")
            .call(d3.svg.axis()
                .scale(yScale)  // スケールを適用する
                .tickValues(function () {
                  return _.range(0, data.length * 2);
                })
                .tickFormat(function (d, i) {
                  return (i % 2 > 0) ? data[cnt++].caption : "";
                })
                .orient("left")
                .tickPadding(5)
                .tickSize(0, 0)// 目盛線の長さ（内側,外側）
        );
      }
    },
    // 横軸
    _createAxisX: {
      value: function _createAxisX(svg, opt, top, left, height, width) {

        // 目盛りを表示するためにスケールを設定
        var xScale = d3.scale.linear()  // スケールを設定
            .domain([0, opt.axisX.max])   // 元のサイズ
            .range([0, width]);

        // 目盛りを設定し表示する
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + left + ", " + height + ")")
            .call(d3.svg.axis()
                .scale(xScale)  // スケールを適用する
                .orient("bottom")   // 目盛りの表示位置を下側に指定
                .tickPadding(5) // 目盛とキャプションの隙間
                .tickSize(0.2)
                .tickSize(-(height - top), 0)// 目盛線の長さ（内側,外側）
        );

        svg.append("line")
            .attr("x1", left)
            .attr("y1", top)
            .attr("x2", left + width)
            .attr("y2", top)
            .attr("stroke-width", 0.2)
            .attr("stroke", "black");

      }
    },
  });

  return HolizontalBarChart;

});
