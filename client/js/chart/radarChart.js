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
        var top = me._drawTitle(svg, me.opt) + 30;
        var width = me.opt.width;
        var height = this._getHeight(me.opt);
        var radius = (height - top - 20) / 2;
        if (width < (height - top - 20)) {
          radius = width / 2;
        }
        var left = (width / 2) - radius;

        var paramCount = me.opt.radar.category.length; // 頂点数
        var max = me.opt.radar.max; // データ最大

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
        me._createGrid(svg, line, left, top, paramCount, max, radius, rScale);

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
    _createGrid: {
      value: function (svg, line, left, top, paramCount, max, radius, rScale) {

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
            .attr("stroke", "#393939")
            .attr("stroke-dasharray",function(d,i){
              if (i == max - 1){
                return "";
              }else{
                return Chart.STROKE_TYPE_DOT;
              }
            })
            .attr("stroke-width", function(d,i){
              if (i == max - 1){
                return 0.7;
              }else{
                return 0.4;
              }
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
              .attr("stroke", "#393939")
              .attr("stroke-dasharray", "2");
        }

        // ラベル描画
        me._createGridLabel(svg, left, top, paramCount, max, radius, rScale);
      }
    },
    _createGridLabel: {
      value: function (svg, left, top, paramCount, max, radius, rScale) {

        var me = this;
        var labelPosition = max + 1;

        svg.selectAll(".dataCaption")
            .attr("class", "dataCaption")
            .data(me.opt.radar.category)
            .enter()
            .append('text')
            .text(function (d, i) {
              return d;
            })
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr('x', function (d, i) {
              return left + rScale(labelPosition) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + radius;
            })
            .attr('y', function (d, i) {
              return top + rScale(labelPosition) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + radius;
            })
            .attr("font-size", me.opt.radar.labelFontSize);

      }
    }
  });

  return RadarChart;

});
