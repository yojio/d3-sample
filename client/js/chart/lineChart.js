/**
 * LineChart
 */
define(['jquery','d3', 'chart/chart' ], function() {
  this.LineChart = function LineChart(option) {
    Chart.call(this, option);

  }

  LineChart.prototype = Object.create(Chart.prototype, {
    constructor : {
      value : LineChart,
      enumerable : false,
      writable : true,
      configurable : true
    },
    // グラフ作成
    _create : {
      value : function(data) {

        var me = this;

        // 領域のリセット
        $(me.opt.dom).empty();

        // グラフ出力サイズ（タイトル・縦ラベル幅を除外）
        var width = me.opt.width - (me.opt.axis.yWidth + 20);

        // 基底オブジェクト生成
        var svg = d3.select(me.opt.dom).append("svg").attr("width",me.opt.width).attr("height", me.opt.height);

        // タイトル描画
        var top = me._drawTitle(svg,me.opt,((me.opt.width - me.opt.axis.yWidth) / 2) + me.opt.axis.yWidth);

        // 縦軸作成
        me._createVerticalAxis(svg,me.opt,top,width);

        // 横軸作成
        me._createHolizontalAxis(svg, me.opt ,top, width,data);

        // 線描画
        me.linePath = new Array(data.data.length);
        me.line = new Array(data.data.length);

        for (var i = 0; i < data.data.length; i++) {
          var line = d3.svg.line()
            .x(function(d, k) {
              return me.opt.axis.yWidth + 7 + (k * (width / (data.caption.length - 1)));
            })
            .y(function(d) {
                var height = me._getHeight(me.opt);
                return (height - top) - (d * ((height - top) / me.opt.axis.max)) + top;
            })
            .interpolate("linear"); // エッジがシャープな

          // 折れ線グラフを描画
          var linePath = svg.append("path")
            .attr("d",line(data.data[i])) // 線を描画
            .attr("stroke", data.color[i]) // 線の色を指定
            .attr("fill", "none") // 塗り潰しなし。指定しないと黒色で塗り潰される
            .attr("stroke-dasharray", "")   // 点線の実線と間隔を交互に指定
            .attr("stroke-width", me.opt.stroke.width);

          me.line[i] = line;
          me.linePath[i] = linePath;
          me.svg = svg;
        }
      }
    },
    _redraw : {
      value : function(data) {

        var me = this;
        var svg = me.svg;

        for (var i = 0; i < data.data.length; i++) {
          me.linePath[i].transition().duration(800).attr('d',
              me.line[i](data.data[i]));
        }

      }
    },
    // 高さ取得
    _getHeight : {
      value : function _getHeight(opt) {
        return opt.height - 20; // x軸フォント高さ
      }
    },
    // 縦軸
    _createVerticalAxis : {
      value : function _createVerticalAxis(svg, opt ,top, width) {

        // y軸
        var height = this._getHeight(opt); // x軸フォント高さ

        var yScale = d3.scale.linear() // スケールを設定
        .domain([ 0, opt.axis.max ]) // 元のサイズ
        .range([ height, top ]);

        svg.append("g")
          .attr("class", "axis")
          .attr("transform","translate(" + (7 + opt.axis.yWidth) + ", 0)")
          .call(d3.svg.axis()
              .scale(yScale) // スケールを適用する
              .orient("left").tickPadding(5).innerTickSize(-width) // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
          );
      }
    },
    // 横軸
    _createHolizontalAxis : {
      value : function _createHolizontalAxis(svg, opt ,top, width,data) {

        // y軸
        var height = this._getHeight(opt); // x軸フォント高さ

        // 目盛りを表示するためにスケールを設定
        var xScale = d3.scale.linear() // スケールを設定
          .domain([ 0, data.caption.length - 1 ]) // 元のサイズ
          .range([ 0, width ]);

        // 目盛りを設定し表示する
        svg.append("g")
          .attr("class", "axis")
          .attr("transform","translate(" + (7 + opt.axis.yWidth) + ", " + height + ")")
          .call(d3.svg.axis().scale(xScale) // スケールを適用する
              .tickValues(function() {
                return _.range(0, data.caption.length);
              })
              .tickFormat(function(d, i) {
                return data.caption[d];
              })
              .orient("bottom") // 目盛りの表示位置を下側に指定
              .tickPadding(5).innerTickSize(-(height - top)) // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
        );

      }
    },
  });

  return LineChart;

});
