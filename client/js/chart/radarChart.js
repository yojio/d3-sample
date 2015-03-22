/**
 * RadarChart
 */
define(['chart/chart'], function () {
  this.RadarChart = function RadarChart(option) {
    Chart.call(this, option);
  };

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
        var top = me._drawTitle(svg, me.opt);
        var width = me.opt.width - 100;
        var left = 50;
        var height = this._getHeight(me.opt);

        var dataset = [
          [5, 5, 2, 5, 5],
          [2, 1, 5, 2, 5]
        ];

        var paramCount = dataset[0].length; // 頂点数
        var max = d3.max(d3.merge(dataset)); // データ最大

        var grid = [];
        for (var i = 1; i <= 5; i++) {
          grid.push([i, i, i, i, i]);
        }

        // label
        var label = [
          {
            position: max + 1
            , caption: 'ラベル1'
          },
          {
            position: max + 1
            , caption: 'ラベル2'
          },
          {
            position: max + 1
            , caption: 'ラベル3'
          },
          {
            position: max + 1
            , caption: 'ラベル4'
          },
          {
            position: max + 1
            , caption: 'ラベル5'
          }
        ];

        var padding = 30;
        var rScale = d3.scale.linear() // スケールを設定
            .domain([0, max]) // 元のサイズ
            .range([0, width / 2 - padding]);

        var line = d3.svg.line()
            .x(function (d, i) {
              return left + rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + width / 2;
            })
            .y(function (d, i) {
              return top + rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + width / 2;
            })
            .interpolate('linear');

        me.line = line;

        // データ描画
        me.linePath = svg.selectAll('path')
            .data(dataset)
            .enter()
            .append('path')
            .attr('d', function (d) {
              return line(d) + "z"
            })
            .attr("stroke", function (d, i) {
              return d3.scale.category10().range()[i];
            })
            .attr("stroke-width", 2)
            .attr('fill', 'none');

        // グリッド描画
        svg.selectAll("path.grid")
            .data(grid)
            .enter()
            .append("path")
            .attr("d", function (d, i) {
              return line(d) + "z";
            })
            .attr("stroke", "black")
            .attr("stroke-dasharray", "2")
            .attr('fill', 'none');

        // グリッド描画
        for (var x = 0; x < paramCount; x++) {
          svg.append("line")
              .data([5])
              .attr("x1", function (d, i) {
                return left + width / 2;
              })
              .attr("y1", function (d, i) {
                return top + width / 2;
              })
              .attr("x2", function (d, i) {
                return left + rScale(d) * Math.cos(2 * Math.PI / paramCount * x - (Math.PI / 2)) + width / 2;
              })
              .attr("y2", function (d, i) {
                return top + rScale(d) * Math.sin(2 * Math.PI / paramCount * x - (Math.PI / 2)) + width / 2;
              })
              .attr("stroke-width", 0.5)
              .attr("stroke", "black")
              .attr("stroke-dasharray", "2");
        }

        svg.selectAll(".dataCaption")
            .attr("class", "dataCaption")
            .data(label)
            .enter()
            .append('text')
            .text(function (d, i) {
              return d.caption;
            })
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr('x', function (d, i) {
              return left + rScale(d.position) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + width / 2;
            })
            .attr('y', function (d, i) {
              return top + rScale(d.position) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + width / 2;
            })
            .attr("font-size", "15px");

      }
    },
    _redraw: {
      value: function (data) {

        var me = this;
        var line = me.line;

        var dataset = [
          [2, 4, 5, 1, 3],
          [3, 5, 1, 4, 2]
        ];

        me.linePath
            .data(dataset)
            .transition()
            .duration(800)
            .attr('d', function (d) {
              return line(d) + "z"
            })

      }
    }
  });

  return RadarChart;

});
