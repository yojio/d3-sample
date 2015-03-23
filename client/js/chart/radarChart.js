/**
 * RadarChart
 */
define(['chart/chart'], function () {
  this.RadarChart = function RadarChart(option) {

    // Chart共通オプションはChart.js参照
    var DEF_OPT = {
      labelFontSize: "15px",
      max: 5,
      category: ['category1', 'category2', 'category3', 'category4', 'category5', 'category6'],
      labelMarginHeight: 20,
      labelMarginWidth: 50,
      grid: {
        color: "#393939",
        outerLineStyle: Chart.STROKE_TYPE_SOLID,
        innerLineStyle: Chart.STROKE_TYPE_DOT
      }
    };

    Chart.call(this, option);
    $.extend(true, this.opt, DEF_OPT, option);
  };
  /* draw時、データ定義サンプル
   * Sample.DATA = [{width: 2,type: Chart.STROKE_TYPE_DASH,color: "#a05d56",value: [2, 3, 2, 1, 4]},{...}];
   */

  RadarChart.prototype = Object.create(Chart.prototype, {
    constructor: {
      value: RadarChart,
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
        // 半径算出
        var top = me._drawTitle(svg, me.opt) + me.opt.labelMarginHeight;
        var height = this._getHeight(me.opt, top);
        var width = me.opt.width - me.opt.labelMarginWidth;
        var radius = (height < width) ? height / 2 : width / 2;
        var left = (me.opt.width / 2) - radius;

        var paramCount = me.opt.category.length; // 系統数
        var max = me.opt.max; // メモリ最大

        var rScale = d3.scale.linear() // スケールを設定
            .domain([0, max]) // 元のサイズ
            .range([0, radius]);

        var line = d3.svg.line()
            .x(function (d, i) {
              return left + rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + radius;
            })
            .y(function (d, i) {
              return top + rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + radius;
            })
            .interpolate('linear');

        me.line = line;

        // データ描画
        me.linePath = svg.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', function (d) {
              return line(d.value) + "z"
            })
            .attr("stroke", function (d, i) {
              return d.color;
            })
            .attr("stroke-width", function (d, i) {
              return d.width;
            })
            .attr("stroke-dasharray", function (d, i) {
              return d.type;
            })
            .attr('fill', 'none');

        // grid生成
        me._createGrid(svg, line, left, top, paramCount, max, radius, rScale, me.opt);

      }
    },
    _redraw: {
      value: function (data) {

        var me = this;
        var line = me.line;

        me.linePath
            .data(data)
            .transition()
            .duration(800)
            .attr('d', function (d) {
              return line(d.value) + "z"
            })

      }
    },
    // 高さ取得
    _getHeight: {
      value: function (opt, top) {
        return opt.height - top - opt.labelMarginHeight;
      }
    },
    _createGrid: {
      value: function (svg, line, left, top, paramCount, max, radius, rScale, opt) {

        var me = this;

        var grid = [];
        for (var i = 1; i <= max; i++) {
          var arr = [];
          for (var k = 1; k <= paramCount; k++) {
            arr.push(i);
          }
          grid.push(arr);
        }

        // グリッド描画
        svg.selectAll("path.grid")
            .data(grid)
            .enter()
            .append("path")
            .attr("d", function (d, i) {
              return line(d) + "z";
            })
            .attr("stroke", me.opt.grid.color)
            .attr("stroke-dasharray", function (d, i) {
              return (i == max - 1) ? me.opt.grid.outerLineStyle : me.opt.grid.innerLineStyle;
            })
            .attr("stroke-width", function (d, i) {
              return (i == max - 1) ? 0.7 : 0.4;
            })
            .attr('fill', 'none');

        // グリッド描画
        for (var x = 0; x < paramCount; x++) {
          svg.append("line")
              .data([max])
              .attr("x1", function (d, i) {
                return left + radius;
              }).attr("y1", function (d, i) {
                return top + radius;
              }).attr("x2", function (d, i) {
                return left + rScale(d) * Math.cos(2 * Math.PI / paramCount * x - (Math.PI / 2)) + radius;
              }).attr("y2", function (d, i) {
                return top + rScale(d) * Math.sin(2 * Math.PI / paramCount * x - (Math.PI / 2)) + radius;
              })
              .attr("stroke-width", 0.4)
              .attr("stroke", me.opt.grid.color)
              .attr("stroke-dasharray", me.opt.grid.innerLineStyle);
        }

        // ラベル描画
        me._createGridLabel(svg, left, top, paramCount, max, radius, rScale);
      }
    },
    _createGridLabel: {
      value: function (svg, left, top, paramCount, max, radius, rScale) {

        var me = this;
        var labelPosition = max;
        var scale = labelPosition / 10; // ラベル位置補正（10分割した時のキャプションの位置に固定する）

        svg.selectAll(".dataCaption")
            .attr("class", "dataCaption")
            .data(me.opt.category)
            .enter()
            .append('text')
            .text(function (d, i) {
              return d;
            })
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr('x', function (d, i) {
              return left + (rScale(labelPosition) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + radius) +
                  (rScale(scale) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)));
            })
            .attr('y', function (d, i) {
              return top + (rScale(labelPosition) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + radius) +
                  (rScale(scale) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)));
            })
            .attr("font-size", me.opt.labelFontSize);

      }
    }
  });

  return RadarChart;

});
