/**
 * HolizontalBarChart
 */
define(['chart/chart'], function () {

  this.HolizontalBarChart = function HolizontalBarChart(option) {

    // Chart共通オプションはChart.js参照
    var DEF_OPT = {
      // 横軸
      axisX: {
        max: 500,
        height: 20
      },
      // 横軸
      axisY: {
        width: 50
      },
      // BARの太さ
      barWeight: HolizontalBarChart.WEIGHT_NORMAL,
      // 右側余裕
      rightMargin: 20
    };

    Chart.call(this, option);
    $.extend(true, this.opt, DEF_OPT, option);
  };

  //BARの太さ
  HolizontalBarChart.WEIGHT_THIN = 0.6;
  HolizontalBarChart.WEIGHT_NORMAL = 0.8;
  HolizontalBarChart.WEIGHT_THICK = 1;

  /* draw時、データ定義サンプル
   *  Sample.DATA = [{caption: "項目1",value: "50",color: "#98abc5"},{データの個数分配列}]
   */
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

        // 横軸作成
        me._createAxisX(svg, me.opt, top, left, height, width);

        // 縦軸作成
        me._createAxisY(svg, me.opt, top, left, height, width, data);

        me.barScale = width / me.opt.axisX.max;   // 比率
        var barAreaSize = height / data.length;
        var barSize = barAreaSize * (0.8 * me.opt.barWeight);  // 棒グラフの縦幅

        svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
            .data(data) // データを設定
            .enter()
            .append("rect") // SVGでの四角形を示す要素を生成
            .attr("stroke", function (d, i) {
              return d.color;
            })
            .attr("x", left)
            .attr("y", function (d, i) {   // Y座標を配列の順序に応じて計算
              var value = top + ((data.length - (i + 1)) * barAreaSize) + ((barAreaSize - barSize) / 2);
              return (value >= 0) ? value : 0;
            })
            .attr("width", function (d) { // 横幅を配列の内容に応じて計算
              var value = (d.value * me.barScale) - 1;
              return ((value >= 0) ? value : 0) + "px"; // 縦軸とかぶるので、widthとtranslateで調整
            })
            .attr("height", barSize)   // 棒グラフの高さを指定
            .attr("transform", "translate(1, 0)")
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
            .duration(800)
            .attr("width", function (d) { // 横幅を配列の内容に応じて計算
              return (d.value * me.barScale) + "px";
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
      value: function (svg, opt, top, left, height, width, data) {

        var yScale = d3.scale.linear()  // スケールを設定
            .domain([0, data.length * 2])   // 元のサイズ
            .range([height, 0]);

        var cnt = 0;

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + left + ", " + top + ")")
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

        svg.append("line")
            .attr("x1", left)
            .attr("y1", top)
            .attr("x2", left + width)
            .attr("y2", top)
            .attr("stroke-width", 0.2)
            .attr("stroke", "black");

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
            .attr("transform", "translate(" + left + ", " + (height + top) + ")")
            .call(d3.svg.axis()
                .scale(xScale)  // スケールを適用する
                .orient("bottom")   // 目盛りの表示位置を下側に指定
                .tickPadding(7) // 目盛とキャプションの隙間
                .tickSize(0.2)
                .tickSize(-(height), 0)// 目盛線の長さ（内側,外側）
        );

      }
    },
  });

  return HolizontalBarChart;

});
